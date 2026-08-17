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
        "manufacturing.view_daily_machine_oee",
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
    ]
}


# ── 2. Exact Physical Table Schemas ─────────────────────────────────────────

TABLE_SCHEMAS_METADATA: Dict[str, str] = {
    "manufacturing.dim_factories": """
    TABLE manufacturing.dim_factories (
        factory_id VARCHAR PRIMARY KEY, -- 'FB-GRS' (Pabrik Gresik), 'FB-NGJ' (Pabrik Nganjuk)
        factory_name VARCHAR,
        location VARCHAR,
        total_production_lines BIGINT
    );
    """,
    "manufacturing.dim_production_lines": """
    TABLE manufacturing.dim_production_lines (
        line_id VARCHAR PRIMARY KEY, -- 'LINE-SPRING-01', 'LINE-SPRING-02', 'LINE-COIL-01', 'LINE-STAB-01'
        line_name VARCHAR,
        factory_id VARCHAR, -- FK ke dim_factories.factory_id
        target_oee_pct DOUBLE, -- Target OEE, e.g. 85.0
        daily_capacity_units BIGINT
    );
    """,
    "manufacturing.dim_machines": """
    TABLE manufacturing.dim_machines (
        machine_id VARCHAR PRIMARY KEY, -- 'MC-PRESS-01', 'MC-FURNACE-01', 'MC-COILER-01', 'MC-SHOT-01'
        machine_name VARCHAR,
        line_id VARCHAR, -- FK ke dim_production_lines.line_id
        machine_type VARCHAR, -- 'Hydraulic Stamping Press', 'Quenching Furnace', 'CNC Spring Coiler', 'Shot Peening Machine'
        installation_year BIGINT,
        status VARCHAR -- 'Operational', 'Maintenance', 'Standby'
    );
    """,
    "manufacturing.dim_spare_parts": """
    TABLE manufacturing.dim_spare_parts (
        part_id VARCHAR PRIMARY KEY, -- 'PRT-SEAL-01', 'PRT-BEAR-01', 'PRT-DIE-01', 'PRT-HEAT-01'
        part_name VARCHAR, -- 'Hydraulic Seal Kit', 'Carbide Punch Die', 'High-Temp Bearing', 'Heating Element Furnace'
        category VARCHAR, -- 'Hydraulic', 'Mechanical', 'Electrical', 'Tooling'
        criticality_level VARCHAR, -- 'Critical', 'Medium', 'Low'
        lead_time_days BIGINT, -- Supplier lead time in days (e.g. 14, 21, 30)
        reorder_point_min BIGINT, -- Minimum Reorder Point (Smart ROP threshold)
        safety_stock_level BIGINT,
        unit_cost_usd DOUBLE
    );
    """,
    "manufacturing.dim_bom_compatibility": """
    TABLE manufacturing.dim_bom_compatibility (
        bom_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        part_id VARCHAR, -- FK ke dim_spare_parts.part_id
        quantity_required BIGINT,
        replacement_frequency_days BIGINT -- Siklus penggantian berkala dalam hari
    );
    """,
    "manufacturing.fact_downtime_logs": """
    TABLE manufacturing.fact_downtime_logs (
        log_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        line_id VARCHAR, -- FK ke dim_production_lines.line_id
        downtime_category VARCHAR, -- 'Unplanned Breakdown', 'Changeover & Setup', 'Planned Maintenance', 'Tooling & Die Wear', 'Speed Loss' (6 Big Losses)
        duration_minutes DOUBLE,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        root_cause VARCHAR
    );
    """,
    "manufacturing.fact_production_outputs": """
    TABLE manufacturing.fact_production_outputs (
        output_id VARCHAR PRIMARY KEY,
        machine_id VARCHAR, -- FK ke dim_machines.machine_id
        sku_id VARCHAR, -- FK ke dim_skus.sku_id
        actual_qty_produced BIGINT,
        timestamp TIMESTAMP
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
    "manufacturing.fact_inventory_snapshots": """
    TABLE manufacturing.fact_inventory_snapshots (
        snapshot_id VARCHAR PRIMARY KEY,
        part_id VARCHAR, -- FK ke dim_spare_parts.part_id
        warehouse_id VARCHAR,
        stock_quantity BIGINT,
        allocated_quantity BIGINT,
        snapshot_date DATE
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
        stock_status VARCHAR -- 'CRITICAL_REORDER', 'SAFE_STOCK', etc.
    );
    """,
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
    "supply_chain.product_master": """
    TABLE supply_chain.product_master (
        product_id VARCHAR PRIMARY KEY,
        product_code_raw VARCHAR,
        product_description_raw VARCHAR,
        uom_raw VARCHAR,
        source_system VARCHAR,
        harmonized_product_id VARCHAR,
        harmonized_product_name VARCHAR, -- 'Leaf Spring Assembly Heavy Duty', 'Parabolic Spring Type A'
        harmonized_uom VARCHAR
    );
    """,
    "supply_chain.risk_event": """
    TABLE supply_chain.risk_event (
        event_id VARCHAR PRIMARY KEY,
        risk_category VARCHAR, -- 'Logistics', 'Supplier', 'Manufacturing', 'Customs'
        risk_level VARCHAR, -- 'High', 'Critical', 'Medium', 'Low'
        confidence_prob DOUBLE, -- 0.0 - 1.0 (e.g. 0.88)
        description VARCHAR,
        potential_impact VARCHAR,
        detected_at DATE,
        status VARCHAR,
        related_entity_ids VARCHAR
    );
    """,
    "supply_chain.logistics_telemetry": """
    TABLE supply_chain.logistics_telemetry (
        shipment_export_id VARCHAR PRIMARY KEY,
        port_code VARCHAR, -- 'IDSUB' (Tanjung Perak), 'IDTPP' (Tanjung Priok)
        customs_status VARCHAR,
        queue_time_hours DOUBLE,
        expected_ship_date DATE,
        actual_ship_date DATE
    );
    """,
    "supply_chain.purchase_order": """
    TABLE supply_chain.purchase_order (
        po_number VARCHAR PRIMARY KEY,
        po_date DATE,
        supplier_id VARCHAR,
        product_id VARCHAR,
        po_qty BIGINT,
        unit_price DOUBLE,
        po_amount DOUBLE,
        plant_id VARCHAR,
        po_status VARCHAR
    );
    """,
    "supply_chain.invoice": """
    TABLE supply_chain.invoice (
        invoice_id VARCHAR PRIMARY KEY,
        invoice_date DATE,
        po_number VARCHAR, -- Match ke supply_chain.purchase_order.po_number
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
        resi_number VARCHAR PRIMARY KEY,
        shipment_date DATE,
        po_number VARCHAR, -- Match ke supply_chain.purchase_order.po_number
        supplier_id VARCHAR,
        product_id VARCHAR,
        received_qty BIGINT,
        warehouse_dock_id VARCHAR,
        receiving_note VARCHAR,
        damage_flag BOOLEAN,
        wms_supplier_name_raw VARCHAR
    );
    """
}


# ── 3. Business Glossary & Official Metrics Rules ───────────────────────────

BUSINESS_METRIC_GLOSSARY: Dict[str, str] = {
    "OEE (Overall Equipment Effectiveness)": (
        "Rumus: (availability_pct * performance_pct * quality_pct) / 10000. "
        "Atau query langsung dari VIEW 'manufacturing.view_daily_machine_oee' yang sudah memuat kolom 'oee_pct', 'availability_pct', 'performance_pct', 'quality_pct'."
    ),
    "6 Big Losses (Downtime Pareto)": (
        "Kategori downtime di 'manufacturing.fact_downtime_logs': 'Unplanned Breakdown', 'Changeover & Setup', "
        "'Planned Maintenance', 'Tooling & Die Wear', 'Speed Loss'. Analisis Pareto menggunakan akumulasi menit downtime."
    ),
    "OTD (On-Time Delivery Rate)": (
        "Rumus dari 'supply_chain.delivery_order': "
        "ROUND(COUNT(CASE WHEN delivery_status IN ('Delivered', 'On-Time', 'Completed') THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1). "
        "Target perusahaan: >= 92.0%."
    ),
    "Smart ROP (Reorder Point MRO)": (
        "Dapat di-query langsung dari VIEW 'manufacturing.view_spare_part_stockout_risk' dengan filter 'is_reorder_triggered = TRUE' "
        "atau dari tabel 'manufacturing.dim_spare_parts' (reorder_point_min) di-join dengan 'fact_inventory_snapshots'."
    ),
    "3-Way Invoice Reconciliation": (
        "Gabungkan 'supply_chain.purchase_order' (po_qty, unit_price, po_amount) dengan "
        "'supply_chain.invoice' (invoiced_qty, unit_price, invoice_amount) dan 'supply_chain.shipment_resi' (received_qty) berdasarkan 'po_number'."
    ),
    "DuckDB SQL Syntax Standards": (
        "1. Gunakan 'GROUP BY ALL' atau 'ORDER BY ALL' untuk efisiensi penulisan query. "
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
