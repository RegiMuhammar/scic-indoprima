"""
Semantic Schema Registry & Business Metrics Dictionary — SCIC Indoprima
Exact physical schemas verified against MotherDuck OLAP catalog.
"""
from typing import Dict, List, Any


# ── 1. Domain Table Grouping ────────────────────────────────────────────────

DOMAIN_TABLE_MAP: Dict[str, List[str]] = {
    "manufacturing": [
        "manufacturing.dim_factories",
        "manufacturing.dim_production_lines",
        "manufacturing.dim_machines",
        "manufacturing.dim_skus",
        "manufacturing.fact_production_schedules",
        "manufacturing.fact_production_outputs",
        "manufacturing.fact_downtime_logs",
        "manufacturing.fact_shift_manpower",
        "manufacturing.fact_quality_inspections",
        "manufacturing.fact_machine_telemetry",
        "manufacturing.fact_anomaly_events",
        "manufacturing.view_daily_machine_oee",
        "manufacturing.view_anomaly_downtime_correlation",
    ],
    "inventory_mro": [
        "manufacturing.dim_spare_parts",
        "manufacturing.dim_bom_compatibility",
        "manufacturing.dim_machines",
        "manufacturing.fact_inventory_snapshots",
        "manufacturing.fact_part_consumptions",
        "manufacturing.fact_purchase_orders",
        "manufacturing.fact_work_orders",
        "manufacturing.fact_work_order_parts",
        "manufacturing.view_spare_part_stockout_risk",
        "supply_chain.product_master",
    ],
    "supply_chain": [
        "supply_chain.supplier_master",
        "supply_chain.product_master",
        "supply_chain.plant_master",
        "supply_chain.delivery_order",
        "supply_chain.logistics_telemetry",
        "supply_chain.risk_event",
        "supply_chain.production_order",
    ],
    "demand_balancing": [
        "supply_chain.demand_history",
        "supply_chain.demand_history_per_branch",
        "supply_chain.inventory_snapshot",
        "supply_chain.branch_transfer_log",
        "supply_chain.product_master",
        "supply_chain.plant_master",
    ],
    "finance": [
        "supply_chain.purchase_order",
        "supply_chain.invoice",
        "supply_chain.shipment_resi",
        "supply_chain.supplier_master",
        "supply_chain.product_master",
    ],
    "executive_cross_domain": [
        "supply_chain.delivery_order",
        "supply_chain.risk_event",
        "supply_chain.production_order",
        "manufacturing.view_daily_machine_oee",
        "manufacturing.fact_downtime_logs",
        "manufacturing.fact_production_outputs",
        "manufacturing.fact_production_schedules",
    ]
}


# ── 2. Exact Physical Table Schemas ─────────────────────────────────────────

TABLE_SCHEMAS_METADATA: Dict[str, str] = {
    # ── Manufacturing Domain ──
    "manufacturing.dim_factories": """
    TABLE manufacturing.dim_factories (
        factory_id VARCHAR PRIMARY KEY, -- 'FB-GRS' (Pabrik Gresik), 'FB-NGJ' (Pabrik Nganjuk)
        factory_name VARCHAR,
        location VARCHAR,
        created_at TIMESTAMP
    );
    """,
    "manufacturing.dim_production_lines": """
    TABLE manufacturing.dim_production_lines (
        line_id VARCHAR PRIMARY KEY, -- 'LINE-SPRING-01', 'LINE-SPRING-02', 'LINE-COIL-01', 'LINE-STABILIZER-01'
        factory_id VARCHAR, -- FK ke dim_factories.factory_id
        line_name VARCHAR,
        target_oee_pct DOUBLE -- Target OEE, e.g. 85.0
    );
    """,
    "manufacturing.dim_machines": """
    TABLE manufacturing.dim_machines (
        machine_id VARCHAR PRIMARY KEY, -- 'MCH-COILING-01', 'MCH-COILING-02', 'MCH-HEATTREAT-01', 'MCH-PRESS-01'
        line_id VARCHAR, -- FK ke dim_production_lines.line_id
        machine_name VARCHAR,
        machine_type VARCHAR, -- 'Hot Coiling', 'Heat Treatment', 'Bending Press', 'Shot Peening'
        is_critical BOOLEAN,
        instrumentation_status VARCHAR, -- 'IoT Instrumented', 'Manual Logging'
        rated_capacity_per_hour DOUBLE
    );
    """,
    "manufacturing.dim_skus": """
    TABLE manufacturing.dim_skus (
        sku_id VARCHAR PRIMARY KEY, -- 'SKU-CS-HONDA-02', 'SKU-LS-ISUZU-03', 'SKU-SB-TOYOTA-01'
        sku_name VARCHAR,
        category VARCHAR, -- 'Coil Spring', 'Leaf Spring', 'Stabilizer Bar'
        ideal_cycle_time_seconds DOUBLE
    );
    """,
    "manufacturing.dim_spare_parts": """
    TABLE manufacturing.dim_spare_parts (
        part_id VARCHAR PRIMARY KEY, -- 'PRT-BRG-6205-2RS', 'PRT-SEAL-HT-50', 'PRT-TC-KTYPE-1200C', 'PRT-NOZZLE-CARB-08'
        part_name VARCHAR,
        category VARCHAR, -- 'Mechanical', 'Hydraulic', 'Thermal / Electrical', 'Pneumatic'
        criticality_level VARCHAR, -- 'Critical', 'Medium', 'Low'
        unit_cost DOUBLE,
        default_supplier_lead_time_days BIGINT,
        min_stock_level BIGINT,
        max_stock_level BIGINT,
        existing_reorder_point BIGINT
    );
    """,
    "manufacturing.dim_bom_compatibility": """
    TABLE manufacturing.dim_bom_compatibility (
        bom_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        part_id VARCHAR, -- FK ke dim_spare_parts.part_id
        qty_required_per_machine BIGINT,
        replacement_freq_days BIGINT -- Siklus penggantian berkala suku cadang dalam hari
    );
    """,
    "manufacturing.fact_production_schedules": """
    TABLE manufacturing.fact_production_schedules (
        schedule_id VARCHAR PRIMARY KEY, -- 'SCH-20260701-MCH-COILING-01-S1'
        schedule_date DATE, -- e.g. '2026-07-01'
        shift_number BIGINT, -- 1 (Pagi), 2 (Sore), 3 (Malam)
        line_id VARCHAR, -- FK ke dim_production_lines.line_id
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        sku_id VARCHAR, -- FK ke dim_skus.sku_id
        planned_start_time TIMESTAMP,
        planned_end_time TIMESTAMP,
        planned_qty BIGINT -- Target unit yang direncanakan
    );
    """,
    "manufacturing.fact_production_outputs": """
    TABLE manufacturing.fact_production_outputs (
        output_id VARCHAR PRIMARY KEY, -- 'OUT-5001'
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        sku_id VARCHAR, -- FK ke dim_skus.sku_id
        shift_number BIGINT, -- 1, 2, 3
        timestamp TIMESTAMP, -- Tanggal & waktu produksi
        actual_qty_produced BIGINT, -- Realisasi kuantitas produksi aktual
        actual_avg_cycle_time_seconds DOUBLE,
        speed_loss_duration_minutes DOUBLE
    );
    """,
    "manufacturing.fact_downtime_logs": """
    TABLE manufacturing.fact_downtime_logs (
        downtime_id VARCHAR PRIMARY KEY, -- 'DT-1001'
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        shift_number BIGINT,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        duration_minutes DOUBLE,
        downtime_category VARCHAR, -- 'Unplanned Breakdown', 'Changeover', 'Planned Maintenance', 'Tooling & Die Wear', 'Speed Loss'
        reason_description VARCHAR,
        is_unplanned BOOLEAN
    );
    """,
    "manufacturing.fact_shift_manpower": """
    TABLE manufacturing.fact_shift_manpower (
        manpower_log_id VARCHAR PRIMARY KEY,
        log_date DATE,
        shift_number BIGINT, -- 1 (Pagi), 2 (Sore), 3 (Malam)
        line_id VARCHAR, -- FK ke dim_production_lines.line_id
        operator_headcount BIGINT,
        total_working_hours DOUBLE,
        effective_working_hours DOUBLE
    );
    """,
    "manufacturing.fact_quality_inspections": """
    TABLE manufacturing.fact_quality_inspections (
        inspection_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        sku_id VARCHAR, -- FK ke dim_skus.sku_id
        inspection_time TIMESTAMP,
        total_inspected_qty BIGINT,
        good_qty BIGINT,
        reject_qty BIGINT,
        rework_qty BIGINT,
        defect_reason_category VARCHAR -- 'Surface Micro-Crack Defect', 'Free Height Dimension Out-of-Spec', etc.
    );
    """,
    "manufacturing.fact_inventory_snapshots": """
    TABLE manufacturing.fact_inventory_snapshots (
        snapshot_id VARCHAR PRIMARY KEY,
        snapshot_date DATE,
        part_id VARCHAR, -- FK ke dim_spare_parts.part_id
        current_stock_qty BIGINT,
        reserved_stock_qty BIGINT,
        available_stock_qty BIGINT,
        smart_reorder_point_ai BIGINT,
        is_reorder_triggered BOOLEAN
    );
    """,
    "manufacturing.fact_part_consumptions": """
    TABLE manufacturing.fact_part_consumptions (
        consumption_id VARCHAR PRIMARY KEY,
        part_id VARCHAR, -- FK ke dim_spare_parts.part_id
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        work_order_id VARCHAR,
        consumption_date DATE,
        qty_consumed BIGINT,
        total_cost DOUBLE
    );
    """,
    "manufacturing.fact_purchase_orders": """
    TABLE manufacturing.fact_purchase_orders (
        po_id VARCHAR PRIMARY KEY,
        po_date DATE,
        part_id VARCHAR, -- FK ke dim_spare_parts.part_id
        supplier_name VARCHAR,
        ordered_qty BIGINT,
        received_qty BIGINT,
        received_date DATE,
        actual_lead_time_days BIGINT,
        unit_price DOUBLE
    );
    """,
    "manufacturing.fact_work_orders": """
    TABLE manufacturing.fact_work_orders (
        work_order_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR,
        downtime_id VARCHAR,
        maintenance_type VARCHAR, -- 'Corrective', 'Preventive'
        failure_code VARCHAR,
        work_start_time TIMESTAMP,
        work_end_time TIMESTAMP,
        duration_hours DOUBLE,
        technician_notes VARCHAR
    );
    """,
    "manufacturing.fact_work_order_parts": """
    TABLE manufacturing.fact_work_order_parts (
        wo_part_id VARCHAR PRIMARY KEY,
        work_order_id VARCHAR,
        part_id VARCHAR,
        qty_used BIGINT
    );
    """,
    "manufacturing.fact_anomaly_events": """
    TABLE manufacturing.fact_anomaly_events (
        anomaly_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR,
        detected_at TIMESTAMP,
        severity_level VARCHAR, -- 'CRITICAL', 'WARNING', 'INFO'
        anomaly_score DOUBLE,
        suspected_failing_component VARCHAR,
        recommended_action VARCHAR
    );
    """,
    "manufacturing.fact_machine_telemetry": """
    TABLE manufacturing.fact_machine_telemetry (
        telemetry_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR,
        timestamp TIMESTAMP,
        vibration_mm_s DOUBLE,
        temperature_celsius DOUBLE,
        current_ampere DOUBLE,
        pressure_bar DOUBLE,
        operating_rpm DOUBLE,
        machine_state VARCHAR
    );
    """,
    "manufacturing.view_daily_machine_oee": """
    VIEW manufacturing.view_daily_machine_oee (
        machine_id VARCHAR,
        machine_name VARCHAR,
        line_id VARCHAR,
        date_key DATE,
        unplanned_downtime_minutes DOUBLE,
        total_downtime_minutes DOUBLE,
        total_produced_units HUGEINT,
        total_good_units HUGEINT,
        total_reject_units HUGEINT,
        availability_pct DOUBLE,
        performance_pct DOUBLE,
        quality_pct DOUBLE,
        oee_pct DOUBLE -- Overall Equipment Effectiveness (0-100%)
    );
    """,
    "manufacturing.view_anomaly_downtime_correlation": """
    VIEW manufacturing.view_anomaly_downtime_correlation (
        anomaly_id VARCHAR,
        detected_at TIMESTAMP,
        machine_name VARCHAR,
        machine_type VARCHAR,
        severity_level VARCHAR,
        anomaly_score DOUBLE,
        suspected_failing_component VARCHAR,
        downtime_id VARCHAR,
        downtime_start_time TIMESTAMP,
        breakdown_duration_minutes DOUBLE,
        work_order_id VARCHAR,
        maintenance_type VARCHAR,
        technician_notes VARCHAR
    );
    """,
    "manufacturing.view_spare_part_stockout_risk": """
    VIEW manufacturing.view_spare_part_stockout_risk (
        snapshot_date DATE,
        part_id VARCHAR,
        part_name VARCHAR,
        category VARCHAR,
        criticality_level VARCHAR,
        current_stock_qty BIGINT,
        reserved_stock_qty BIGINT,
        available_stock_qty BIGINT,
        existing_reorder_point BIGINT,
        smart_reorder_point_ai BIGINT,
        is_reorder_triggered BOOLEAN,
        stock_status VARCHAR -- 'OPTIMAL', 'CRITICAL_REORDER', 'SAFE_STOCK'
    );
    """,

    # ── Supply Chain Domain ──
    "supply_chain.delivery_order": """
    TABLE supply_chain.delivery_order (
        delivery_order_id VARCHAR PRIMARY KEY, -- 'DO-202501', 'DO-202502'
        customer_id VARCHAR, -- 'CUST_ASTRA', 'CUST_TOYOTA', 'CUST_HINO', 'CUST_ISUZU'
        product_id VARCHAR,
        promised_delivery_date DATE,
        actual_delivery_date DATE,
        qty BIGINT,
        order_value DOUBLE, -- Nilai pesanan dalam USD
        plant_id VARCHAR,
        delivery_status VARCHAR -- 'Delivered', 'On-Time', 'In Transit', 'Delayed', 'Pending'
    );
    """,
    "supply_chain.production_order": """
    TABLE supply_chain.production_order (
        production_order_id VARCHAR PRIMARY KEY, -- 'PROD-2025000'
        plant_id VARCHAR, -- 'PLT-SBY-01', 'PLT-KRW-02'
        line_id VARCHAR, -- 'Line 1', 'Line 3'
        product_id VARCHAR,
        planned_qty BIGINT,
        actual_qty BIGINT,
        planned_start DATE,
        planned_end DATE,
        actual_start DATE,
        actual_end DATE,
        downtime_hours BIGINT,
        downtime_reason VARCHAR
    );
    """,
    "supply_chain.product_master": """
    TABLE supply_chain.product_master (
        product_id VARCHAR PRIMARY KEY, -- 'PRD-001', 'PRD-002'
        product_code_raw VARCHAR,
        product_description_raw VARCHAR,
        uom_raw VARCHAR,
        source_system VARCHAR,
        harmonized_product_id VARCHAR,
        harmonized_product_name VARCHAR, -- 'Engine Fastener M10 Steel (AF-M10-ST)', 'Parabolic Leaf Spring Type B'
        harmonized_uom VARCHAR
    );
    """,
    "supply_chain.supplier_master": """
    TABLE supply_chain.supplier_master (
        supplier_id VARCHAR PRIMARY KEY, -- 'SUP-001', 'SUP-002'
        supplier_name_raw VARCHAR,
        source_system VARCHAR,
        tax_id VARCHAR,
        harmonized_supplier_id VARCHAR,
        harmonized_supplier_name VARCHAR -- 'PT Steelindo Utama', 'CV Bina Karya Metal'
    );
    """,
    "supply_chain.plant_master": """
    TABLE supply_chain.plant_master (
        plant_id VARCHAR PRIMARY KEY, -- 'PLT-SBY-01', 'PLT-KRW-02', 'PLT-BKS-03'
        plant_name VARCHAR, -- 'Surabaya Plant', 'Karawang Plant', 'Bekasi Plant'
        location_code VARCHAR,
        facility_type VARCHAR
    );
    """,
    "supply_chain.risk_event": """
    TABLE supply_chain.risk_event (
        event_id VARCHAR PRIMARY KEY, -- 'RE-001'
        risk_category VARCHAR, -- 'Equipment Failure', 'Supply Chain Delay', 'Customs', 'Supplier Quality'
        risk_level VARCHAR, -- 'Critical', 'High', 'Medium', 'Low'
        confidence_prob DOUBLE, -- 0.0 - 1.0 (e.g. 0.88)
        description VARCHAR,
        potential_impact VARCHAR,
        detected_at DATE,
        status VARCHAR, -- 'Open', 'Mitigating', 'Closed'
        related_entity_ids VARCHAR
    );
    """,
    "supply_chain.logistics_telemetry": """
    TABLE supply_chain.logistics_telemetry (
        shipment_export_id VARCHAR PRIMARY KEY,
        port_code VARCHAR, -- 'JKT' (Tanjung Priok), 'SUB' (Tanjung Perak)
        customs_status VARCHAR,
        queue_time_hours DOUBLE,
        expected_ship_date DATE,
        actual_ship_date DATE
    );
    """,
    "supply_chain.purchase_order": """
    TABLE supply_chain.purchase_order (
        po_number VARCHAR PRIMARY KEY, -- 'PO-77820-PT'
        po_date DATE,
        supplier_id VARCHAR,
        product_id VARCHAR,
        po_qty BIGINT,
        unit_price DOUBLE,
        po_amount DOUBLE,
        plant_id VARCHAR,
        po_status VARCHAR -- 'Closed', 'Open', 'Pending'
    );
    """,
    "supply_chain.invoice": """
    TABLE supply_chain.invoice (
        invoice_id VARCHAR PRIMARY KEY, -- 'INV-2025-1000'
        invoice_date DATE,
        po_number VARCHAR, -- Match ke purchase_order.po_number
        supplier_id VARCHAR,
        product_id VARCHAR,
        invoiced_qty BIGINT,
        unit_price DOUBLE,
        invoice_amount DOUBLE,
        currency VARCHAR,
        erp_supplier_name_raw VARCHAR
    );
    """,
    "supply_chain.shipment_resi": """
    TABLE supply_chain.shipment_resi (
        resi_number VARCHAR PRIMARY KEY, -- 'RESI-IND-88219'
        shipment_date DATE,
        po_number VARCHAR, -- Match ke purchase_order.po_number
        supplier_id VARCHAR,
        product_id VARCHAR,
        received_qty BIGINT,
        warehouse_dock_id VARCHAR,
        receiving_note VARCHAR,
        damage_flag BOOLEAN,
        wms_supplier_name_raw VARCHAR
    );
    """,
    "supply_chain.inventory_snapshot": """
    TABLE supply_chain.inventory_snapshot (
        sku_id VARCHAR,
        warehouse_id VARCHAR, -- 'WH-SBY-01', 'WH-KRW-02'
        warehouse_name VARCHAR,
        snapshot_date DATE,
        on_hand_qty BIGINT,
        safety_stock_qty BIGINT,
        reorder_point BIGINT,
        lead_time_days BIGINT,
        unit_cost_usd DOUBLE,
        inventory_value_usd DOUBLE,
        holding_cost_month_usd DOUBLE,
        avg_monthly_consumption BIGINT,
        days_of_supply DOUBLE,
        velocity_category VARCHAR,
        last_movement_date DATE,
        aging_days BIGINT,
        stock_status VARCHAR
    );
    """,
    "supply_chain.branch_transfer_log": """
    TABLE supply_chain.branch_transfer_log (
        transfer_id VARCHAR PRIMARY KEY,
        sku_id VARCHAR,
        product_name VARCHAR,
        source_warehouse VARCHAR,
        destination_warehouse VARCHAR,
        transfer_qty BIGINT,
        unit_cost_usd DOUBLE,
        transfer_value_usd DOUBLE,
        reason VARCHAR,
        requested_by VARCHAR,
        requested_date DATE,
        approved_date DATE,
        completed_date DATE,
        status VARCHAR,
        transport_days BIGINT,
        transport_cost_usd DOUBLE,
        trigger_type VARCHAR,
        ai_recommendation_id VARCHAR
    );
    """,
    "supply_chain.demand_history": """
    TABLE supply_chain.demand_history (
        sku_id VARCHAR,
        period VARCHAR, -- '2025-Q1', '2025-06'
        actual_demand_qty BIGINT,
        customer_segment VARCHAR
    );
    """,
    "supply_chain.demand_history_per_branch": """
    TABLE supply_chain.demand_history_per_branch (
        sku_id VARCHAR,
        warehouse_id VARCHAR,
        period VARCHAR,
        actual_consumption_qty BIGINT,
        avg_daily_consumption DOUBLE,
        trend_direction VARCHAR,
        demand_variability DOUBLE
    );
    """,
    "supply_chain.ai_insight_log": """
    TABLE supply_chain.ai_insight_log (
        insight_id VARCHAR PRIMARY KEY,
        module VARCHAR,
        priority VARCHAR,
        title VARCHAR,
        summary VARCHAR,
        contributing_factors VARCHAR,
        confidence_score DOUBLE,
        business_impact VARCHAR,
        recommended_action VARCHAR,
        created_at TIMESTAMP
    );
    """,
    "supply_chain.audit_log": """
    TABLE supply_chain.audit_log (
        log_id VARCHAR PRIMARY KEY,
        module VARCHAR,
        original_ai_proposal VARCHAR,
        human_decision VARCHAR,
        decision_role VARCHAR,
        note VARCHAR,
        timestamp TIMESTAMP
    );
    """
}


# ── 3. Business Glossary & Official Metrics Rules ───────────────────────────

BUSINESS_METRIC_GLOSSARY: Dict[str, str] = {
    "Production Achievement Rate (Pencapaian Produksi vs Target)": (
        "Definisi: Persentase realisasi kuantitas output fisik terhadap jadwal yang direncanakan. "
        "Rumus Utama (Manufaktur Output vs Schedule): "
        "SELECT ROUND(SUM(o.actual_qty_produced) * 100.0 / NULLIF(SUM(s.planned_qty), 0), 1) AS prod_achievement_pct "
        "FROM manufacturing.fact_production_outputs o "
        "JOIN manufacturing.fact_production_schedules s "
        "  ON o.machine_id = s.machine_id AND DATE(o.timestamp) = s.schedule_date AND o.shift_number = s.shift_number. "
        "Atau dari supply chain production order: "
        "SELECT ROUND(SUM(actual_qty) * 100.0 / NULLIF(SUM(planned_qty), 0), 1) AS prod_achievement_pct FROM supply_chain.production_order. "
        "Target standar operasional: >= 95.0%."
    ),
    "OTD (On-Time Delivery Rate)": (
        "Definisi: Persentase order pengiriman yang sampai tepat waktu sesuai tanggal janji (promised delivery date). "
        "Rumus dari 'supply_chain.delivery_order': "
        "SELECT ROUND(COUNT(CASE WHEN delivery_status IN ('Delivered', 'On-Time', 'Completed') THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS otd_pct "
        "FROM supply_chain.delivery_order. "
        "Target perusahaan: >= 92.0%."
    ),
    "OEE (Overall Equipment Effectiveness)": (
        "Rumus: (availability_pct * performance_pct * quality_pct) / 10000. "
        "Dapat di-query langsung dari VIEW 'manufacturing.view_daily_machine_oee' yang sudah memuat kolom "
        "'oee_pct', 'availability_pct', 'performance_pct', 'quality_pct', 'line_id', 'machine_name'. "
        "Benchmark standar kelas dunia: >= 85.0%."
    ),
    "6 Big Losses (Downtime Pareto)": (
        "Kategori downtime di 'manufacturing.fact_downtime_logs': 'Unplanned Breakdown', 'Changeover', "
        "'Planned Maintenance', 'Tooling & Die Wear', 'Speed Loss'. Analisis Pareto menggunakan akumulasi duration_minutes."
    ),
    "Smart ROP (Reorder Point MRO) & Stockout Risk": (
        "Dapat di-query langsung dari VIEW 'manufacturing.view_spare_part_stockout_risk' dengan filter 'is_reorder_triggered = TRUE' "
        "atau dari tabel 'manufacturing.dim_spare_parts' di-join dengan 'fact_inventory_snapshots'."
    ),
    "3-Way Invoice Reconciliation": (
        "Gabungkan 'supply_chain.purchase_order' (po_qty, unit_price, po_amount) dengan "
        "'supply_chain.invoice' (invoiced_qty, unit_price, invoice_amount) dan 'supply_chain.shipment_resi' (received_qty) berdasarkan 'po_number'."
    ),
    "DuckDB SQL Syntax Standards": (
        "1. Gunakan 'GROUP BY ALL' atau 'ORDER BY ALL' untuk efisiensi agregasi. "
        "2. Gunakan 'QUALIFY ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)' untuk ranking tanpa subquery. "
        "3. Gunakan 'arg_max(col, date_col)' atau 'arg_min()' untuk mencari nilai terbaru. "
        "4. Selalu batasi output dengan LIMIT (maks 1000). "
        "5. Hanya buat query SELECT atau CTE (WITH), dilarang keras membuat DDL/DML mutation."
    )
}


def get_pruned_schema_context(domain: str, extra_tables: List[str] = None) -> str:
    """
    Returns concise DDL and column schema context pruned specifically for the requested domain.
    """
    tables_to_include = set(DOMAIN_TABLE_MAP.get(domain, []))
    if not tables_to_include:
        tables_to_include = set(DOMAIN_TABLE_MAP["manufacturing"][:6] + DOMAIN_TABLE_MAP["supply_chain"][:6])
    
    if extra_tables:
        for t in extra_tables:
            tables_to_include.add(t)

    ddl_chunks = []
    for table_name in sorted(tables_to_include):
        if table_name in TABLE_SCHEMAS_METADATA:
            ddl_chunks.append(TABLE_SCHEMAS_METADATA[table_name].strip())

    return "\n\n".join(ddl_chunks)


def get_domain_glossary_context(domain: str) -> str:
    """Returns relevant business metric definitions for system prompt."""
    glossary_lines = []
    for name, definition in BUSINESS_METRIC_GLOSSARY.items():
        glossary_lines.append(f"- **{name}**: {definition}")
    return "\n".join(glossary_lines)
