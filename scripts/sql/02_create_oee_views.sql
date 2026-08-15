-- ============================================================================
-- SCIC PT Indoprima — Manufacturing Analytical Views
-- Target Database: MotherDuck (DuckDB Cloud)
-- Database Name: indoprima
-- Schema Name  : manufacturing
-- ============================================================================

USE indoprima.manufacturing;

-- ============================================================================
-- 1. View OEE Calculation Harian per Mesin (`view_daily_machine_oee`)
-- Calculates Availability %, Performance %, Quality %, and composite OEE %
-- ============================================================================
CREATE OR REPLACE VIEW view_daily_machine_oee AS
WITH availability_calc AS (
    SELECT 
        machine_id,
        CAST(start_time AS DATE) AS date_key,
        SUM(COALESCE(duration_minutes, 0)) AS total_downtime_minutes,
        SUM(CASE WHEN is_unplanned THEN COALESCE(duration_minutes, 0) ELSE 0 END) AS unplanned_downtime_minutes
    FROM fact_downtime_logs
    GROUP BY machine_id, CAST(start_time AS DATE)
),
performance_calc AS (
    SELECT 
        po.machine_id,
        CAST(po.timestamp AS DATE) AS date_key,
        SUM(po.actual_qty_produced) AS total_produced_units,
        SUM(po.actual_qty_produced * s.ideal_cycle_time_seconds) / 60.0 AS ideal_operating_minutes,
        SUM(COALESCE(po.speed_loss_duration_minutes, 0)) AS total_speed_loss_minutes
    FROM fact_production_outputs po
    JOIN dim_skus s ON po.sku_id = s.sku_id
    GROUP BY po.machine_id, CAST(po.timestamp AS DATE)
),
quality_calc AS (
    SELECT 
        machine_id,
        CAST(inspection_time AS DATE) AS date_key,
        SUM(total_inspected_qty) AS inspected_units,
        SUM(good_qty) AS total_good_units,
        SUM(reject_qty) AS total_reject_units,
        SUM(rework_qty) AS total_rework_units
    FROM fact_quality_inspections
    GROUP BY machine_id, CAST(inspection_time AS DATE)
),
dates AS (
    SELECT DISTINCT date_key FROM performance_calc
)
SELECT 
    m.machine_id,
    m.machine_name,
    m.line_id,
    d.date_key,
    COALESCE(a.unplanned_downtime_minutes, 0) AS unplanned_downtime_minutes,
    COALESCE(a.total_downtime_minutes, 0) AS total_downtime_minutes,
    COALESCE(p.total_produced_units, 0) AS total_produced_units,
    COALESCE(q.total_good_units, 0) AS total_good_units,
    COALESCE(q.total_reject_units, 0) AS total_reject_units,
    -- Availability % (Shift baseline = 24 hours operating time per day = 1440 mins)
    ROUND(LEAST(100.0, GREATEST(0.0, ((1440.0 - COALESCE(a.total_downtime_minutes, 0)) / 1440.0) * 100)), 2) AS availability_pct,
    -- Performance %
    ROUND(LEAST(100.0, GREATEST(0.0, CASE WHEN (1440.0 - COALESCE(a.total_downtime_minutes, 0)) > 0 
        THEN (COALESCE(p.ideal_operating_minutes, 0) / (1440.0 - COALESCE(a.total_downtime_minutes, 0))) * 100.0 
        ELSE 100.0 END)), 2) AS performance_pct,
    -- Quality %
    ROUND(CASE WHEN COALESCE(q.inspected_units, 0) > 0 THEN (q.total_good_units * 100.0 / q.inspected_units) ELSE 100.0 END, 2) AS quality_pct,
    -- Overall OEE %
    ROUND((
        LEAST(100.0, GREATEST(0.0, ((1440.0 - COALESCE(a.total_downtime_minutes, 0)) / 1440.0) * 100)) *
        LEAST(100.0, GREATEST(0.0, CASE WHEN (1440.0 - COALESCE(a.total_downtime_minutes, 0)) > 0 
            THEN (COALESCE(p.ideal_operating_minutes, 0) / (1440.0 - COALESCE(a.total_downtime_minutes, 0))) * 100.0 
            ELSE 100.0 END)) *
        (CASE WHEN COALESCE(q.inspected_units, 0) > 0 THEN (q.total_good_units * 100.0 / q.inspected_units) ELSE 100.0 END)
    ) / 10000.0, 2) AS oee_pct
FROM dim_machines m
CROSS JOIN dates d
LEFT JOIN performance_calc p ON m.machine_id = p.machine_id AND d.date_key = p.date_key
LEFT JOIN availability_calc a ON m.machine_id = a.machine_id AND d.date_key = a.date_key
LEFT JOIN quality_calc q ON m.machine_id = q.machine_id AND d.date_key = q.date_key;

-- ============================================================================
-- 2. View Peringatan Stok & Smart Reorder Point (`view_spare_part_stockout_risk`)
-- ============================================================================
CREATE OR REPLACE VIEW view_spare_part_stockout_risk AS
SELECT 
    s.snapshot_date,
    p.part_id,
    p.part_name,
    p.category,
    p.criticality_level,
    s.current_stock_qty,
    s.reserved_stock_qty,
    s.available_stock_qty,
    p.existing_reorder_point,
    s.smart_reorder_point_ai,
    s.is_reorder_triggered,
    CASE 
        WHEN s.available_stock_qty <= p.min_stock_level THEN 'CRITICAL_STOCKOUT_RISK'
        WHEN s.available_stock_qty <= s.smart_reorder_point_ai THEN 'AI_REORDER_RECOMMENDED'
        WHEN s.available_stock_qty <= p.existing_reorder_point THEN 'REORDER_POINT_REACHED'
        ELSE 'OPTIMAL'
    END AS stock_status
FROM fact_inventory_snapshots s
JOIN dim_spare_parts p ON s.part_id = p.part_id;

-- ============================================================================
-- 3. View Korelasi Sinyal Anomali IoT & Breakdown Mesin (`view_anomaly_downtime_correlation`)
-- ============================================================================
CREATE OR REPLACE VIEW view_anomaly_downtime_correlation AS
SELECT 
    a.anomaly_id,
    a.detected_at,
    m.machine_name,
    m.machine_type,
    a.severity_level,
    a.anomaly_score,
    a.suspected_failing_component,
    d.downtime_id,
    d.start_time AS downtime_start_time,
    d.duration_minutes AS breakdown_duration_minutes,
    w.work_order_id,
    w.maintenance_type,
    w.technician_notes
FROM fact_anomaly_events a
JOIN dim_machines m ON a.machine_id = m.machine_id
LEFT JOIN fact_downtime_logs d ON a.machine_id = d.machine_id 
    AND d.start_time BETWEEN a.detected_at AND a.detected_at + INTERVAL 4 HOUR
LEFT JOIN fact_work_orders w ON d.downtime_id = w.downtime_id;
