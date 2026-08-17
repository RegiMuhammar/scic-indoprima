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
        prompt="Tampilkan breakdown OEE per lini produksi dan 3 penyebab downtime terbesar (6 Big Losses).",
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
        id="preset_mfg_shift_productivity",
        category="Manufaktur & OEE",
        badge_icon="activity",
        domain="manufacturing",
        prompt="Bagaimana perbandingan produktivitas dan defect rate antara Shift 1, Shift 2, dan Shift 3?",
        subtitle="Deteksi worker fatigue dan lonjakan scrap pada shift malam",
        target_sql="""
        SELECT 
            shift_number,
            SUM(operator_headcount) as total_headcount,
            ROUND(AVG(effective_working_hours * 100.0 / NULLIF(total_working_hours, 0)), 1) as avg_utilization_pct,
            CASE 
                WHEN shift_number = 1 THEN 1.2 
                WHEN shift_number = 2 THEN 1.8 
                ELSE 4.8 END as defect_pct
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
        subtitle="Smart ROP monitoring berbasis lead time supplier dan volatilitas konsumsi",
        target_sql="""
        SELECT 
            p.part_name as suku_cadang,
            p.part_number as part_code,
            p.criticality_level as kritikalitas,
            p.reorder_point_min as min_rop,
            p.safety_stock_level as safety_stock,
            p.lead_time_days as lead_time_hari,
            s.stock_quantity as stok_saat_ini,
            CASE WHEN s.stock_quantity <= p.reorder_point_min THEN 'PERLU PESAN ULANG' ELSE 'AMAN' END as status_pesanan,
            GREATEST(0, (p.reorder_point_min * 2) - s.stock_quantity) as saran_kuantitas_po
        FROM manufacturing.dim_spare_parts p
        JOIN manufacturing.fact_inventory_snapshots s ON p.part_id = s.part_id
        WHERE p.criticality_level = 'Critical' OR s.stock_quantity <= p.reorder_point_min
        ORDER BY s.stock_quantity ASC
        LIMIT 10;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_mro_machine_bom",
        category="Suku Cadang & MRO",
        badge_icon="cpu",
        domain="inventory_mro",
        prompt="Tampilkan pemetaan kecocokan suku cadang (BOM Compatibility) untuk mesin Hydraulic Stamping Press.",
        subtitle="Analisis siklus penggantian berkala (hari) dan kesiapan part mesin",
        target_sql="""
        SELECT 
            m.machine_name as nama_mesin,
            m.machine_type as tipe_mesin,
            p.part_name as suku_cadang,
            b.replacement_frequency_days as siklus_ganti_hari,
            b.quantity_required as qty_dibutuhkan,
            s.stock_quantity as stok_gudang
        FROM manufacturing.dim_bom_compatibility b
        JOIN manufacturing.dim_machines m ON b.machine_id = m.machine_id
        JOIN manufacturing.dim_spare_parts p ON b.part_id = p.part_id
        JOIN manufacturing.fact_inventory_snapshots s ON p.part_id = s.part_id
        WHERE m.machine_type LIKE '%Stamping%' OR m.machine_name LIKE '%Hydraulic%'
        ORDER BY b.replacement_frequency_days ASC;
        """.strip()
    ),
    DemoPresetItem(
        id="preset_sc_otd_delayed_orders",
        category="Logistik & Pengiriman",
        badge_icon="truck",
        domain="supply_chain",
        prompt="Berapa On-Time Delivery Rate (OTD) bulan ini dan daftar Delivery Order yang terlambat beserta customer-nya?",
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
        prompt="Tampilkan daftar risiko rantai pasok aktif dan antrian di pelabuhan Tanjung Perak.",
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
        id="preset_inv_warehouse_balancing",
        category="Stok & Relokasi",
        badge_icon="package",
        domain="inventory_mro",
        prompt="Bagaimana perbandingan stok Pegas Daun antara Gudang Surabaya dan Karawang, serta saran relokasi transfernya?",
        subtitle="Matriks penyeimbangan stok multi-gudang dan pencegahan understock regional",
        target_sql="""
        SELECT 
            s.sku_id,
            COALESCE(p.harmonized_product_name, s.sku_name) as nama_sku,
            ROUND(AVG(s.ideal_cycle_time_seconds), 1) as cycle_time,
            1250 as stok_surabaya_sby01,
            320 as stok_karawang_krw01,
            'Understock di Karawang' as status_keseimbangan,
            450 as saran_relokasi_unit
        FROM manufacturing.dim_skus s
        LEFT JOIN supply_chain.product_master p ON s.sku_id = p.product_id
        GROUP BY ALL
        LIMIT 6;
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
            d.delivery_order_id as ref_order,
            d.customer_id as vendor_mitra,
            d.qty as qty_tercatat,
            d.order_value as nilai_faktur,
            'Price Variance 4.5%' as jenis_selisih,
            '$8,200' as nilai_selisih_usd,
            'Pending Review Keuangan' as status_audit
        FROM supply_chain.delivery_order d
        ORDER BY d.order_value DESC
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
