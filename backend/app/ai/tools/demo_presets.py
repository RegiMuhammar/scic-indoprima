"""
Golden Demo Presets Catalog — SCIC Indoprima AI Copilot
Curated benchmark questions and verified SQL queries for 1-click testing & executive demos.
"""
from typing import List
from app.schemas.chat import DemoPresetItem

GOLDEN_DEMO_PRESETS: List[DemoPresetItem] = [
    DemoPresetItem(
        id="preset_mfg_oee_downtime",
        category="Manufaktur & OEE",
        badge_icon="factory",
        domain="manufacturing",
        prompt="Tampilkan breakdown OEE per lini produksi dan penyebab downtime terbesar (6 Big Losses).",
        subtitle="Analisis ketersediaan, performa, dan Pareto 80:20 downtime mesin",
        target_sql="""
        WITH totals AS (
            SELECT SUM(duration_minutes) as total_min FROM manufacturing.fact_downtime_logs
        ),
        loss_summary AS (
            SELECT 
                downtime_category as category,
                SUM(duration_minutes) as minutes,
                ROUND(SUM(duration_minutes) * 100.0 / (SELECT total_min FROM totals), 1) as pct
            FROM manufacturing.fact_downtime_logs
            GROUP BY downtime_category
        )
        SELECT 
            category,
            minutes,
            pct,
            ROUND(SUM(pct) OVER (ORDER BY minutes DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 1) as cumulative_pct
        FROM loss_summary
        ORDER BY minutes DESC
        LIMIT 5;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_mfg_production_achievement",
        category="Manufaktur & OEE",
        badge_icon="trending-up",
        domain="manufacturing",
        prompt="Berapa nilai production achievement (pencapaian output vs target jadwal) saat ini?",
        subtitle="Evaluasi realisasi output produksi fisik terhadap target kapasitas jadwal",
        target_sql="""
        SELECT 
            ROUND(SUM(o.actual_qty_produced) * 100.0 / NULLIF(SUM(s.planned_qty), 0), 1) as prod_achievement_pct,
            SUM(o.actual_qty_produced) as total_unit_aktual,
            SUM(s.planned_qty) as total_unit_jadwal
        FROM manufacturing.fact_production_outputs o
        JOIN manufacturing.fact_production_schedules s 
          ON o.machine_id = s.machine_id 
          AND DATE(o.timestamp) = s.schedule_date 
          AND o.shift_number = s.shift_number;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_mfg_shift_productivity",
        category="Manufaktur & OEE",
        badge_icon="activity",
        domain="manufacturing",
        prompt="Bagaimana perbandingan produktivitas dan utilisasi kerja antara Shift 1, Shift 2, dan Shift 3?",
        subtitle="Deteksi efektivitas jam kerja dan utilisasi operator per shift",
        target_sql="""
        SELECT 
            shift_number,
            SUM(operator_headcount) as total_headcount,
            ROUND(AVG(effective_working_hours * 100.0 / NULLIF(total_working_hours, 0)), 1) as avg_utilization_pct,
            ROUND(SUM(effective_working_hours), 1) as total_jam_efektif
        FROM manufacturing.fact_shift_manpower
        GROUP BY shift_number
        ORDER BY shift_number;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_mro_critical_rop",
        category="Suku Cadang & MRO",
        badge_icon="wrench",
        domain="inventory_mro",
        prompt="Suku cadang kritis apa saja yang stoknya di bawah batas aman Reorder Point dan perlu segera dipesan?",
        subtitle="Smart ROP monitoring berbasis lead time supplier dan status stockout",
        target_sql="""
        SELECT 
            p.part_name as suku_cadang,
            p.part_id as part_code,
            p.criticality_level as kritikalitas,
            p.existing_reorder_point as min_rop,
            s.current_stock_qty as stok_saat_ini,
            s.available_stock_qty as stok_tersedia,
            s.smart_reorder_point_ai as smart_rop_ai,
            CASE WHEN s.is_reorder_triggered THEN 'PERLU PESAN ULANG' ELSE 'AMAN' END as status_pesanan,
            GREATEST(0, (s.smart_reorder_point_ai * 2) - s.available_stock_qty) as saran_kuantitas_po
        FROM manufacturing.dim_spare_parts p
        JOIN manufacturing.fact_inventory_snapshots s ON p.part_id = s.part_id
        WHERE p.criticality_level = 'Critical' OR s.is_reorder_triggered = TRUE
        ORDER BY s.available_stock_qty ASC
        LIMIT 10;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_mro_machine_bom",
        category="Suku Cadang & MRO",
        badge_icon="cpu",
        domain="inventory_mro",
        prompt="Tampilkan pemetaan kecocokan suku cadang (BOM Compatibility) untuk mesin Hot Coiling dan Press.",
        subtitle="Analisis siklus penggantian berkala (hari) dan kesiapan part mesin",
        target_sql="""
        SELECT 
            m.machine_name as nama_mesin,
            m.machine_type as tipe_mesin,
            p.part_name as suku_cadang,
            b.replacement_freq_days as siklus_ganti_hari,
            b.qty_required_per_machine as qty_dibutuhkan,
            s.current_stock_qty as stok_gudang
        FROM manufacturing.dim_bom_compatibility b
        JOIN manufacturing.dim_machines m ON b.machine_id = m.machine_id
        JOIN manufacturing.dim_spare_parts p ON b.part_id = p.part_id
        JOIN manufacturing.fact_inventory_snapshots s ON p.part_id = s.part_id
        WHERE m.machine_type LIKE '%Coil%' OR m.machine_type LIKE '%Press%'
        ORDER BY b.replacement_freq_days ASC
        LIMIT 10;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_sc_otd_delayed_orders",
        category="Logistik & Pengiriman",
        badge_icon="truck",
        domain="supply_chain",
        prompt="Berapa On-Time Delivery Rate (OTD) dan daftar Delivery Order yang terlambat beserta customer-nya?",
        subtitle="Monitoring keterlambatan pengiriman OEM dan eksposur finansial SLA",
        target_sql="""
        SELECT 
            d.delivery_order_id as nomor_do,
            d.customer_id as customer,
            COALESCE(p.harmonized_product_name, d.product_id) as produk,
            d.qty as kuantitas,
            d.delivery_status as status,
            CAST(d.promised_delivery_date AS VARCHAR) as etd_janji,
            CONCAT('$', CAST(ROUND(d.order_value, 0) AS VARCHAR)) as nilai_order
        FROM supply_chain.delivery_order d
        LEFT JOIN supply_chain.product_master p ON d.product_id = p.product_id
        WHERE d.delivery_status IN ('Delayed', 'Pending')
        ORDER BY d.promised_delivery_date ASC
        LIMIT 10;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_sc_port_risks",
        category="Logistik & Pengiriman",
        badge_icon="alert-triangle",
        domain="supply_chain",
        prompt="Tampilkan daftar risiko rantai pasok aktif dan antrian di pelabuhan.",
        subtitle="Early warning logistik pelabuhan dan probabilitas dampak operasional",
        target_sql="""
        SELECT 
            event_id as id_event,
            risk_category as kategori,
            description as deskripsi_risiko,
            potential_impact as dampak,
            risk_level as tingkat_risiko,
            ROUND(confidence_prob * 100, 1) as probabilitas_pct,
            CAST(detected_at AS VARCHAR) as terdeteksi_pada
        FROM supply_chain.risk_event
        ORDER BY confidence_prob DESC
        LIMIT 5;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_fin_invoice_reconciliation",
        category="Rekonsiliasi Faktur",
        badge_icon="dollar-sign",
        domain="finance",
        prompt="Tampilkan 5 transaksi PO vs Invoice dengan selisih harga atau kuantitas terbesar (Discrepancy Log).",
        subtitle="Deteksi anomali 3-Way Matching faktur supplier vs purchase order",
        target_sql="""
        SELECT 
            po.po_number as nomor_po,
            po.supplier_id as vendor,
            po.po_qty as qty_po,
            COALESCE(sr.received_qty, 0) as qty_diterima_resi,
            COALESCE(inv.invoiced_qty, 0) as qty_faktur_invoice,
            po.po_amount as nilai_po_usd,
            COALESCE(inv.invoice_amount, 0) as nilai_faktur_usd,
            ROUND(ABS(po.po_amount - COALESCE(inv.invoice_amount, 0)), 2) as selisih_usd,
            CASE 
                WHEN inv.invoiced_qty IS NULL THEN 'Faktur Belum Diterima'
                WHEN sr.received_qty IS NULL THEN 'Resi Gudang Belum Ada'
                WHEN po.po_qty != inv.invoiced_qty OR po.po_amount != inv.invoice_amount THEN 'Discrepancy (Selisih)'
                ELSE 'Matched (Sesuai)'
            END as status_rekonsiliasi
        FROM supply_chain.purchase_order po
        LEFT JOIN supply_chain.invoice inv ON po.po_number = inv.po_number
        LEFT JOIN supply_chain.shipment_resi sr ON po.po_number = sr.po_number
        WHERE po.po_qty != inv.invoiced_qty OR po.po_amount != inv.invoice_amount OR inv.invoiced_qty IS NULL
        ORDER BY selisih_usd DESC
        LIMIT 5;
        """.strip()
    )
]

def get_all_presets() -> List[DemoPresetItem]:
    """Returns all available demo presets."""
    return GOLDEN_DEMO_PRESETS

def get_presets_by_domain(domain: str) -> List[DemoPresetItem]:
    """Filters presets by domain key."""
    if not domain or domain == "general":
        return GOLDEN_DEMO_PRESETS
    return [p for p in GOLDEN_DEMO_PRESETS if p.domain == domain]
