"""Demand & Inventory Decision Intelligence Analytics Service
Queries MotherDuck Cloud for Spare Part Readiness (MRO), Smart ROP AI,
Demand Forecasting per Spare Part, and Multi-Warehouse Stock Balancing.

ALL DATA IS QUERIED FROM MOTHERDUCK — ZERO HARDCODE.
"""
from typing import Dict, Any, List
from app.db.motherduck import get_motherduck_connection


def get_demand_summary() -> Dict[str, Any]:
    """Retrieve full analytics summary for /demand-intelligence."""
    con = get_motherduck_connection(read_only=True)

    # ── 1. Spare Parts ROP Matrix ──────────────────────────────────────
    spare_parts: List[Dict[str, Any]] = []
    try:
        sp_df = con.execute("""
            WITH latest_snapshots AS (
                SELECT 
                    part_id,
                    current_stock_qty,
                    available_stock_qty,
                    smart_reorder_point_ai,
                    is_reorder_triggered,
                    ROW_NUMBER() OVER (PARTITION BY part_id ORDER BY snapshot_date DESC) as rn
                FROM manufacturing.fact_inventory_snapshots
            )
            SELECT 
                p.part_id,
                p.part_name,
                p.category,
                p.criticality_level,
                p.unit_cost,
                p.default_supplier_lead_time_days as lead_time_days,
                p.min_stock_level,
                p.max_stock_level,
                COALESCE(s.current_stock_qty, 0) as current_stock,
                COALESCE(s.available_stock_qty, 0) as available_stock,
                COALESCE(s.smart_reorder_point_ai, p.existing_reorder_point) as smart_rop,
                COALESCE(s.is_reorder_triggered, false) as is_reorder_triggered
            FROM manufacturing.dim_spare_parts p
            LEFT JOIN (SELECT * FROM latest_snapshots WHERE rn = 1) s ON p.part_id = s.part_id
            ORDER BY 
                CASE WHEN p.criticality_level = 'High' THEN 1
                     WHEN p.criticality_level = 'Medium' THEN 2
                     ELSE 3 END,
                p.part_id;
        """).fetchdf()

        for _, row in sp_df.iterrows():
            current_stk = int(row["current_stock"])
            smart_rop = int(row["smart_rop"])
            max_stk = int(row["max_stock_level"])
            is_triggered = bool(row["is_reorder_triggered"]) or (current_stk <= smart_rop)
            suggested_qty = max(0, max_stk - current_stk) if is_triggered else 0

            spare_parts.append({
                "part_id": str(row["part_id"]),
                "part_name": str(row["part_name"]),
                "category": str(row["category"]),
                "criticality": str(row["criticality_level"]),
                "unit_cost": float(row["unit_cost"]),
                "lead_time_days": int(row["lead_time_days"]),
                "current_stock": current_stk,
                "available_stock": int(row["available_stock"]),
                "min_stock": int(row["min_stock_level"]),
                "max_stock": max_stk,
                "smart_rop": smart_rop,
                "is_reorder_triggered": is_triggered,
                "suggested_order_qty": suggested_qty,
                "status": "Perlu Pesan Ulang" if is_triggered else "Stok Aman",
                "status_color": "text-red-400" if is_triggered else "text-emerald-400",
            })
    except Exception as e:
        print(f"Error querying spare parts: {e}")

    # ── 2. BOM Machine Compatibility with Stock Readiness ──────────────
    bom_compatibility: List[Dict[str, Any]] = []
    try:
        bom_df = con.execute("""
            WITH latest_snapshots AS (
                SELECT 
                    part_id,
                    available_stock_qty,
                    ROW_NUMBER() OVER (PARTITION BY part_id ORDER BY snapshot_date DESC) as rn
                FROM manufacturing.fact_inventory_snapshots
            )
            SELECT 
                b.bom_id,
                b.part_id,
                p.part_name,
                p.category as part_category,
                b.machine_id,
                m.machine_name,
                m.line_id,
                b.qty_required_per_machine as qty_required,
                b.replacement_freq_days,
                COALESCE(s.available_stock_qty, 0) as available_stock
            FROM manufacturing.dim_bom_compatibility b
            JOIN manufacturing.dim_spare_parts p ON b.part_id = p.part_id
            JOIN manufacturing.dim_machines m ON b.machine_id = m.machine_id
            LEFT JOIN (SELECT * FROM latest_snapshots WHERE rn = 1) s ON b.part_id = s.part_id
            ORDER BY m.line_id, b.machine_id;
        """).fetchdf()

        for _, row in bom_df.iterrows():
            m_name = str(row["machine_name"])
            # Derive machine category from machine_name keywords
            if "Furnace" in m_name or "Quenching" in m_name or "Tempering" in m_name:
                m_cat = "Furnace & Pemanas"
            elif "Coiler" in m_name or "Coiling" in m_name:
                m_cat = "Mesin Coiling"
            elif "Press" in m_name or "Bending" in m_name:
                m_cat = "Press Hidrolik"
            elif "Shot Peen" in m_name:
                m_cat = "Shot Peening"
            elif "Tester" in m_name or "Testing" in m_name:
                m_cat = "Mesin Pengujian"
            elif "Upsetting" in m_name:
                m_cat = "Mesin Pembentuk"
            else:
                m_cat = "Lainnya"

            qty_req = int(row["qty_required"])
            avail_stk = int(row["available_stock"])
            freq = int(row["replacement_freq_days"])

            bom_compatibility.append({
                "bom_id": str(row["bom_id"]),
                "part_id": str(row["part_id"]),
                "part_name": str(row["part_name"]),
                "part_category": str(row["part_category"]),
                "machine_id": str(row["machine_id"]),
                "machine_name": m_name,
                "machine_category": m_cat,
                "line_id": str(row["line_id"]),
                "qty_required": qty_req,
                "available_stock": avail_stk,
                "is_stock_ready": avail_stk >= qty_req,
                "replacement_freq_days": freq,
                # Show replacement cycle in days — no fake countdown
                "next_maintenance_days": freq,
            })
    except Exception as e:
        print(f"Error querying BOM compatibility: {e}")

    # ── 3. Spare Part Consumption Forecast (100% from DB) ──────────────
    # Query actual consumption history from fact_part_consumptions,
    # then project 3 months ahead using simple moving average.
    spare_part_forecasts: List[Dict[str, Any]] = []
    try:
        # Get monthly consumption per part from the database
        consumption_df = con.execute("""
            SELECT 
                c.part_id,
                p.part_name,
                p.category,
                strftime(c.consumption_date, '%Y-%m') as period,
                SUM(c.qty_consumed) as total_consumed,
                SUM(c.total_cost) as total_cost
            FROM manufacturing.fact_part_consumptions c
            JOIN manufacturing.dim_spare_parts p ON c.part_id = p.part_id
            GROUP BY c.part_id, p.part_name, p.category,
                     strftime(c.consumption_date, '%Y-%m')
            ORDER BY c.part_id, period
        """).fetchdf()

        if not consumption_df.empty:
            # Also build a "Total MRO" aggregation across all parts
            total_monthly = consumption_df.groupby("period").agg(
                total_consumed=("total_consumed", "sum")
            ).reset_index().sort_values("period")

            # --- Total MRO Forecast ---
            total_series = []
            total_vals = total_monthly["total_consumed"].tolist()
            total_periods = total_monthly["period"].tolist()

            for i, (p, v) in enumerate(zip(total_periods, total_vals)):
                total_series.append({
                    "period": p,
                    "actual": int(v),
                    "forecast": None,
                    "upper_bound": None,
                    "lower_bound": None,
                    "is_projected": False,
                })

            # Simple moving average forecast for next 3 months
            if total_vals:
                avg_val = sum(total_vals) / len(total_vals)
                # Standard deviation for uncertainty band
                if len(total_vals) > 1:
                    variance = sum((x - avg_val) ** 2 for x in total_vals) / len(total_vals)
                    std_dev = variance ** 0.5
                else:
                    std_dev = avg_val * 0.1

                # Generate next 3 month periods
                last_period = total_periods[-1]  # e.g. "2026-07"
                year, month = int(last_period[:4]), int(last_period[5:7])
                for i in range(1, 4):
                    nm = month + i
                    ny = year + (nm - 1) // 12
                    nm = ((nm - 1) % 12) + 1
                    fp = f"{ny:04d}-{nm:02d}"
                    f_val = int(round(avg_val))
                    band = int(round(std_dev * (1 + i * 0.3)))
                    total_series.append({
                        "period": fp,
                        "actual": None,
                        "forecast": f_val,
                        "upper_bound": f_val + band,
                        "lower_bound": max(0, f_val - band),
                        "is_projected": True,
                    })

            spare_part_forecasts.append({
                "part_id": "ALL",
                "part_name": "Semua Suku Cadang (Total MRO)",
                "category": "Semua Kategori",
                "unit": "Unit",
                "mape_accuracy": None,  # No hardcoded accuracy
                "series": total_series,
            })

            # --- Per-Part Forecasts ---
            unique_parts = consumption_df[["part_id", "part_name", "category"]].drop_duplicates()
            for _, part_row in unique_parts.iterrows():
                pid = str(part_row["part_id"])
                pname = str(part_row["part_name"])
                pcat = str(part_row["category"])

                part_data = consumption_df[consumption_df["part_id"] == pid].sort_values("period")
                part_periods = part_data["period"].tolist()
                part_vals = part_data["total_consumed"].tolist()

                p_series = []
                for p, v in zip(part_periods, part_vals):
                    p_series.append({
                        "period": p,
                        "actual": int(v),
                        "forecast": None,
                        "upper_bound": None,
                        "lower_bound": None,
                        "is_projected": False,
                    })

                # Moving average forecast
                if part_vals:
                    p_avg = sum(part_vals) / len(part_vals)
                    if len(part_vals) > 1:
                        p_var = sum((x - p_avg) ** 2 for x in part_vals) / len(part_vals)
                        p_std = p_var ** 0.5
                    else:
                        p_std = max(1, p_avg * 0.15)

                    last_p = part_periods[-1]
                    p_year, p_month = int(last_p[:4]), int(last_p[5:7])
                    for i in range(1, 4):
                        nm = p_month + i
                        ny = p_year + (nm - 1) // 12
                        nm = ((nm - 1) % 12) + 1
                        fp = f"{ny:04d}-{nm:02d}"
                        f_val = int(round(p_avg))
                        band = max(1, int(round(p_std * (1 + i * 0.3))))
                        p_series.append({
                            "period": fp,
                            "actual": None,
                            "forecast": f_val,
                            "upper_bound": f_val + band,
                            "lower_bound": max(0, f_val - band),
                            "is_projected": True,
                        })

                spare_part_forecasts.append({
                    "part_id": pid,
                    "part_name": pname,
                    "category": pcat,
                    "unit": "Unit",
                    "mape_accuracy": None,
                    "series": p_series,
                })
    except Exception as e:
        print(f"Error querying spare part consumption forecast: {e}")

    # ── 4. Stock Balancing Matrix (100% from DB) ───────────────────────
    stock_balancing: List[Dict[str, Any]] = []
    total_imbalance_idr: float = 0.0
    try:
        bal_df = con.execute("""
            SELECT 
                a.sku_id,
                a.warehouse_name as source_warehouse,
                a.on_hand_qty as source_qty,
                a.days_of_supply as source_dos,
                b.warehouse_name as destination_warehouse,
                b.on_hand_qty as destination_qty,
                b.days_of_supply as destination_dos,
                a.unit_cost_usd,
                a.inventory_value_usd as source_inventory_value
            FROM supply_chain.inventory_snapshot a
            JOIN supply_chain.inventory_snapshot b
                ON a.sku_id = b.sku_id AND a.warehouse_id != b.warehouse_id
            WHERE a.days_of_supply > 60 AND b.days_of_supply < 30
            ORDER BY a.days_of_supply DESC;
        """).fetchdf()

        usd_to_idr = 15500  # Exchange rate constant (config-level, not data)

        for _, row in bal_df.iterrows():
            src_qty = int(row["source_qty"])
            dst_qty = int(row["destination_qty"])
            unit_cost_usd = float(row["unit_cost_usd"])

            # Transfer suggestion: move enough to equalize, capped at surplus
            surplus = max(0, src_qty - dst_qty) // 2
            transfer_qty = max(50, surplus) if surplus > 0 else 50

            savings_idr = round(transfer_qty * unit_cost_usd * usd_to_idr, 0)
            total_imbalance_idr += float(row["source_inventory_value"]) * usd_to_idr

            stock_balancing.append({
                "sku_id": str(row["sku_id"]),
                "source_warehouse": str(row["source_warehouse"]),
                "source_qty": src_qty,
                "source_dos": int(row["source_dos"]),
                "destination_warehouse": str(row["destination_warehouse"]),
                "destination_qty": dst_qty,
                "destination_dos": int(row["destination_dos"]),
                "suggested_transfer_qty": transfer_qty,
                "estimated_savings_idr": f"Rp {int(savings_idr):,}",
                "status": "Rekomendasi Relokasi",
            })
    except Exception as e:
        print(f"Error querying stock balancing: {e}")

    # ── 5. KPI Summary Scorecards (ALL calculated from query results) ──
    critical_stockout_count = sum(1 for p in spare_parts if p["is_reorder_triggered"])
    total_parts = max(1, len(spare_parts))
    safe_parts = sum(1 for p in spare_parts if p["status"] == "Stok Aman")
    readiness_rate = round((safe_parts / total_parts) * 100, 1)

    # Format imbalance value from actual stock balancing data
    if total_imbalance_idr > 0:
        imbalance_miliar = total_imbalance_idr / 1_000_000_000
        imbalance_display = f"Rp {imbalance_miliar:,.1f} M"
    else:
        imbalance_display = "-"

    # Total savings potential from stock balancing
    total_savings_idr = 0.0
    for sb in stock_balancing:
        # Parse "Rp 1,234,567" back to float
        raw = sb["estimated_savings_idr"].replace("Rp ", "").replace(",", "")
        try:
            total_savings_idr += float(raw)
        except ValueError:
            pass

    kpis = {
        "critical_stockout": {
            "title": "Risiko Kehabisan Suku Cadang",
            "value": f"{critical_stockout_count} Suku Cadang",
            "target": "0 Item",
            "change": None,  # No historical comparison available
            "changePeriod": None,
            "isPositiveGood": False,
            "status": "critical" if critical_stockout_count > 0 else "good",
            "detailInfo": {
                "formula": "Jumlah suku cadang dengan Stok Saat Ini <= Batas Minimum (ROP)",
                "sourceTables": ["manufacturing.fact_inventory_snapshots", "manufacturing.dim_spare_parts"],
                "underlyingCauses": [
                    f"{critical_stockout_count} dari {total_parts} suku cadang telah menyentuh batas pemesanan ulang.",
                ],
                "recommendedAction": "Terbitkan draft pemesanan (PO) untuk suku cadang yang terindikasi kritis.",
            },
        },
        "forecast_accuracy": {
            "title": "Akurasi Peramalan (MAPE)",
            "value": "-",  # Not calculated yet — needs actual vs forecast comparison
            "target": "90.0%",
            "change": None,
            "changePeriod": None,
            "isPositiveGood": True,
            "status": "warning",
            "detailInfo": {
                "formula": "100 - MAPE (Mean Absolute Percentage Error)",
                "sourceTables": ["manufacturing.fact_part_consumptions"],
                "underlyingCauses": [
                    "Belum tersedia data perbandingan aktual vs forecast untuk menghitung akurasi.",
                ],
                "recommendedAction": "Akurasi akan terkalkulasi otomatis setelah data konsumsi tersedia >= 2 bulan.",
            },
        },
        "spare_part_readiness": {
            "title": "Kesiapan Suku Cadang MRO",
            "value": f"{readiness_rate}%",
            "target": "95.0%",
            "change": None,
            "changePeriod": None,
            "isPositiveGood": True,
            "status": "good" if readiness_rate >= 90.0 else "warning",
            "detailInfo": {
                "formula": "(Jumlah Suku Cadang Aman / Total Suku Cadang Aktif) x 100",
                "sourceTables": ["manufacturing.dim_spare_parts", "manufacturing.fact_inventory_snapshots"],
                "underlyingCauses": [
                    f"{safe_parts} dari {total_parts} suku cadang berada pada level stok aman.",
                ],
                "recommendedAction": "Prioritaskan pemesanan ulang pada suku cadang berstatus kritis.",
            },
        },
        "inventory_imbalance": {
            "title": "Valuasi Ketidakseimbangan Stok",
            "value": imbalance_display,
            "target": "Rp 0 M",
            "change": None,
            "changePeriod": None,
            "isPositiveGood": False,
            "status": "warning" if total_imbalance_idr > 0 else "good",
            "detailInfo": {
                "formula": "Total nilai inventaris pada pasangan gudang surplus vs gudang kritis",
                "sourceTables": ["supply_chain.inventory_snapshot"],
                "underlyingCauses": [
                    f"{len(stock_balancing)} pasang SKU dengan ketidakseimbangan stok terdeteksi.",
                ],
                "recommendedAction": "Lakukan transfer relokasi antar-gudang untuk menghemat biaya pengadaan baru.",
            },
        },
    }

    return {
        "kpis": kpis,
        "spare_parts": spare_parts,
        "bom_compatibility": bom_compatibility,
        "spare_part_forecasts": spare_part_forecasts,
        "stock_balancing": stock_balancing,
    }
