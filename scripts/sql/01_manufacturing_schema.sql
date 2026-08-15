-- ============================================================================
-- SCIC PT Indoprima — Manufacturing Quick Win DDL Schema Script
-- Target Database: MotherDuck (DuckDB Cloud)
-- Database Name: indoprima
-- Schema Name  : manufacturing
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS manufacturing;
USE manufacturing;

-- ============================================================================
-- 1. DIMENSION TABLES (MASTER DATA)
-- ============================================================================

-- Master Pabrik
CREATE TABLE IF NOT EXISTS dim_factories (
    factory_id VARCHAR PRIMARY KEY,
    factory_name VARCHAR NOT NULL,
    location VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master Lini Produksi
CREATE TABLE IF NOT EXISTS dim_production_lines (
    line_id VARCHAR PRIMARY KEY,
    factory_id VARCHAR NOT NULL,
    line_name VARCHAR NOT NULL,
    target_oee_pct DOUBLE DEFAULT 85.0
);

-- Master Mesin & Asset Kritis
CREATE TABLE IF NOT EXISTS dim_machines (
    machine_id VARCHAR PRIMARY KEY,
    line_id VARCHAR NOT NULL,
    machine_name VARCHAR NOT NULL,
    machine_type VARCHAR NOT NULL,
    is_critical BOOLEAN DEFAULT FALSE,
    instrumentation_status VARCHAR DEFAULT 'Manual/Analog', -- 'Full IoT', 'Partial Sensor', 'Manual/Analog'
    rated_capacity_per_hour DOUBLE
);

-- Master SKU Produk & Standard Cycle Time
CREATE TABLE IF NOT EXISTS dim_skus (
    sku_id VARCHAR PRIMARY KEY,
    sku_name VARCHAR NOT NULL,
    category VARCHAR,
    ideal_cycle_time_seconds DOUBLE NOT NULL
);

-- Master Suku Cadang (Spare Parts)
CREATE TABLE IF NOT EXISTS dim_spare_parts (
    part_id VARCHAR PRIMARY KEY,
    part_name VARCHAR NOT NULL,
    category VARCHAR,
    criticality_level VARCHAR DEFAULT 'Medium', -- 'Critical', 'Medium', 'Low'
    unit_cost DECIMAL(15,2) DEFAULT 0.00,
    default_supplier_lead_time_days INTEGER DEFAULT 7,
    min_stock_level INTEGER DEFAULT 5,
    max_stock_level INTEGER DEFAULT 50,
    existing_reorder_point INTEGER DEFAULT 10
);

-- Master BOM & Kompatibilitas Part ke Mesin
CREATE TABLE IF NOT EXISTS dim_bom_compatibility (
    bom_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    part_id VARCHAR NOT NULL,
    qty_required_per_machine INTEGER DEFAULT 1,
    replacement_freq_days INTEGER
);

-- ============================================================================
-- 2. OEE & PRODUCTION FACT TABLES
-- ============================================================================

-- Jadwal Rencana Produksi per Shift
CREATE TABLE IF NOT EXISTS fact_production_schedules (
    schedule_id VARCHAR PRIMARY KEY,
    schedule_date DATE NOT NULL,
    shift_number INTEGER NOT NULL,
    line_id VARCHAR NOT NULL,
    machine_id VARCHAR NOT NULL,
    sku_id VARCHAR NOT NULL,
    planned_start_time TIMESTAMP NOT NULL,
    planned_end_time TIMESTAMP NOT NULL,
    planned_qty INTEGER NOT NULL
);

-- Log Downtime & Stop Mesin
CREATE TABLE IF NOT EXISTS fact_downtime_logs (
    downtime_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    shift_number INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes DOUBLE,
    downtime_category VARCHAR NOT NULL, -- 'Unplanned Breakdown', 'Changeover', 'Planned Maintenance', 'Setup Loss'
    reason_description TEXT,
    is_unplanned BOOLEAN DEFAULT TRUE
);

-- Output Produksi Aktual & Cycle Time
CREATE TABLE IF NOT EXISTS fact_production_outputs (
    output_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    sku_id VARCHAR NOT NULL,
    shift_number INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    actual_qty_produced INTEGER NOT NULL,
    actual_avg_cycle_time_seconds DOUBLE,
    speed_loss_duration_minutes DOUBLE DEFAULT 0.0
);

-- Hasil Inspeksi Quality Control & Defect
CREATE TABLE IF NOT EXISTS fact_quality_inspections (
    inspection_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    sku_id VARCHAR NOT NULL,
    inspection_time TIMESTAMP NOT NULL,
    total_inspected_qty INTEGER NOT NULL,
    good_qty INTEGER NOT NULL,
    reject_qty INTEGER DEFAULT 0,
    rework_qty INTEGER DEFAULT 0,
    defect_reason_category VARCHAR
);

-- Struktur & Utilisasi Tenaga Kerja per Shift
CREATE TABLE IF NOT EXISTS fact_shift_manpower (
    manpower_log_id VARCHAR PRIMARY KEY,
    log_date DATE NOT NULL,
    shift_number INTEGER NOT NULL,
    line_id VARCHAR NOT NULL,
    operator_headcount INTEGER NOT NULL,
    total_working_hours DOUBLE NOT NULL,
    effective_working_hours DOUBLE
);

-- ============================================================================
-- 3. SPARE PART & INVENTORY FACT TABLES
-- ============================================================================

-- Historis Pengeluaran Spare Part Gudang
CREATE TABLE IF NOT EXISTS fact_part_consumptions (
    consumption_id VARCHAR PRIMARY KEY,
    part_id VARCHAR NOT NULL,
    machine_id VARCHAR NOT NULL,
    work_order_id VARCHAR,
    consumption_date DATE NOT NULL,
    qty_consumed INTEGER NOT NULL,
    total_cost DECIMAL(15,2)
);

-- Snapshot Stok Harian & Reorder Trigger
CREATE TABLE IF NOT EXISTS fact_inventory_snapshots (
    snapshot_id VARCHAR PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    part_id VARCHAR NOT NULL,
    current_stock_qty INTEGER NOT NULL,
    reserved_stock_qty INTEGER DEFAULT 0,
    available_stock_qty INTEGER NOT NULL,
    smart_reorder_point_ai INTEGER,
    is_reorder_triggered BOOLEAN DEFAULT FALSE
);

-- Histori Pembelian & Lead Time Supplier
CREATE TABLE IF NOT EXISTS fact_purchase_orders (
    po_id VARCHAR PRIMARY KEY,
    po_date DATE NOT NULL,
    part_id VARCHAR NOT NULL,
    supplier_name VARCHAR NOT NULL,
    ordered_qty INTEGER NOT NULL,
    received_qty INTEGER DEFAULT 0,
    received_date DATE,
    actual_lead_time_days INTEGER,
    unit_price DECIMAL(15,2)
);

-- Riwayat Perbaikan / Work Order Maintenance
CREATE TABLE IF NOT EXISTS fact_work_orders (
    work_order_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    downtime_id VARCHAR,
    maintenance_type VARCHAR NOT NULL, -- 'Corrective', 'Preventive', 'Predictive AI-Triggered'
    failure_code VARCHAR,
    work_start_time TIMESTAMP,
    work_end_time TIMESTAMP,
    duration_hours DOUBLE,
    technician_notes TEXT
);

-- Bridge Table Spare Part di Work Order
CREATE TABLE IF NOT EXISTS fact_work_order_parts (
    wo_part_id VARCHAR PRIMARY KEY,
    work_order_id VARCHAR NOT NULL,
    part_id VARCHAR NOT NULL,
    qty_used INTEGER NOT NULL
);

-- ============================================================================
-- 4. TELEMETRY & CONDITION MONITORING TABLES
-- ============================================================================

-- Telemetri Sensor Real-Time Mesin
CREATE TABLE IF NOT EXISTS fact_machine_telemetry (
    telemetry_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    vibration_mm_s DOUBLE,
    temperature_celsius DOUBLE,
    current_ampere DOUBLE,
    pressure_bar DOUBLE,
    operating_rpm DOUBLE,
    machine_state VARCHAR DEFAULT 'RUNNING'
);

-- Sinyal Deteksi Anomali AI
CREATE TABLE IF NOT EXISTS fact_anomaly_events (
    anomaly_id VARCHAR PRIMARY KEY,
    machine_id VARCHAR NOT NULL,
    detected_at TIMESTAMP NOT NULL,
    severity_level VARCHAR DEFAULT 'WARNING', -- 'CRITICAL', 'WARNING', 'INFO'
    anomaly_score DOUBLE NOT NULL,
    suspected_failing_component VARCHAR,
    recommended_action TEXT
);
