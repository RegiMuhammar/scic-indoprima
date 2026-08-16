# Metrics Specification — Manufacturing Productivity (OEE)
> **Route:** `/manufacturing-oee` atau Tab Dedicated di `/dashboard`  
> **Target Role:** Plant Manager, Production Superintendent, Maintenance & Reliability Engineer  
> **Database:** MotherDuck (`scic_analytics.manufacturing`)  

---

## 1. Tiga Pilar OEE (Overall Equipment Effectiveness)

$$ \text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality} $$

### 1.1 Availability Rate (%)
* **Formula:** $\frac{\text{Operating Time}}{\text{Planned Production Time}} \times 100 = \frac{\text{Planned Time} - \text{Total Downtime}}{\text{Planned Time}} \times 100$
* **Target:** $\ge 90.0\%$
* **Data Lineage:** `fact_production_schedules`, `fact_downtime_logs`
* **Query SQL:**
  ```sql
  SELECT 
      m.line_id,
      ROUND(100.0 * (SUM(480) - SUM(COALESCE(d.duration_minutes, 0))) / NULLIF(SUM(480), 0), 2) AS availability_pct
  FROM dim_machines m
  LEFT JOIN fact_downtime_logs d ON m.machine_id = d.machine_id
  GROUP BY m.line_id;
  ```

### 1.2 Performance Rate (%)
* **Formula:** $\frac{\text{Ideal Cycle Time} \times \text{Total Output Quantity}}{\text{Operating Time}} \times 100$
* **Target:** $\ge 95.0\%$
* **Data Lineage:** `fact_production_outputs`, `dim_skus.ideal_cycle_time_seconds`
* **Query SQL:**
  ```sql
  SELECT 
      m.line_id,
      ROUND(100.0 * SUM(po.actual_qty_produced * s.ideal_cycle_time_seconds / 60.0) 
            / NULLIF(SUM(480 - COALESCE(d.duration_minutes, 0)), 0), 2) AS performance_pct
  FROM fact_production_outputs po
  JOIN dim_machines m ON po.machine_id = m.machine_id
  JOIN dim_skus s ON po.sku_id = s.sku_id
  LEFT JOIN fact_downtime_logs d ON po.machine_id = d.machine_id AND po.shift_number = d.shift_number
  GROUP BY m.line_id;
  ```

### 1.3 Quality Rate (%)
* **Formula:** $\frac{\text{Good Units Produced}}{\text{Total Units Inspected}} \times 100$
* **Target:** $\ge 99.0\%$
* **Data Lineage:** `fact_quality_inspections.good_qty`, `fact_quality_inspections.total_inspected_qty`
* **Query SQL:**
  ```sql
  SELECT 
      m.line_id,
      ROUND(100.0 * SUM(good_qty) / NULLIF(SUM(total_inspected_qty), 0), 2) AS quality_pct,
      SUM(reject_qty) AS total_reject_units,
      SUM(rework_qty) AS total_rework_units
  FROM fact_quality_inspections q
  JOIN dim_machines m ON q.machine_id = m.machine_id
  GROUP BY m.line_id;
  ```

---

## 2. 6 Big Losses & Downtime Pareto

### 2.1 Downtime Category Breakdown (Menit & Frekuensi)
* **Komponen UI:** Pareto Bar Chart
* **Kategori Losses:**
  1. `Unplanned Breakdown` (Equipment Failure)
  2. `Changeover & Setup` (Die exchange, calibration)
  3. `Planned Maintenance` (Scheduled servicing)
  4. `Tooling & Minor Adjustments`
  5. `Speed Loss` (Operating below rated speed)
* **Query SQL:**
  ```sql
  SELECT 
      downtime_category,
      COUNT(*) AS event_count,
      SUM(duration_minutes) AS total_duration_minutes,
      ROUND(100.0 * SUM(duration_minutes) / (SELECT SUM(duration_minutes) FROM fact_downtime_logs), 1) AS pct_of_total
  FROM fact_downtime_logs
  GROUP BY downtime_category
  ORDER BY total_duration_minutes DESC;
  ```

---

## 3. Shift Performance & Fatigue Analysis

### 3.1 Perbandingan Output & Efisiensi Antar Shift (1, 2, 3)
* **Komponen UI:** Grouped Bar Chart
* **Query SQL:**
  ```sql
  SELECT 
      shift_number,
      SUM(operator_headcount) AS total_operators,
      ROUND(AVG(effective_working_hours / NULLIF(total_working_hours, 0)) * 100, 1) AS labor_utilization_pct,
      (SELECT SUM(actual_qty_produced) FROM fact_production_outputs po WHERE po.shift_number = sm.shift_number) AS total_output_qty,
      (SELECT SUM(reject_qty) FROM fact_quality_inspections qi WHERE qi.shift_number = sm.shift_number) AS total_defect_qty
  FROM fact_shift_manpower sm
  GROUP BY shift_number
  ORDER BY shift_number;
  ```
* **Kondisi Khusus (Shift 3 Malam):** Defect rate naik ~15-20% akibat kelelahan operator.

---

## 4. IoT Sensor Telemetry & Condition Monitoring

### 4.1 Real-Time Machine Health Signals
* **Komponen UI:** Multi-Line Time-Series Chart
* **Parameter Sensor:**
  * **Vibration (`vibration_mm_s`)**: Normal $\le 3.5\text{ mm/s}$, Warning $3.6 - 5.5\text{ mm/s}$, Critical $> 5.5\text{ mm/s}$.
  * **Temperature (`temperature_celsius`)**: Normal $\le 65^\circ\text{C}$, Warning $66 - 80^\circ\text{C}$, Critical $> 80^\circ\text{C}$.
  * **Current (`current_ampere`)**: Fluktuasi beban motor hidrolik.
* **Query SQL:**
  ```sql
  SELECT timestamp, vibration_mm_s, temperature_celsius, current_ampere, operating_rpm, machine_state
  FROM fact_machine_telemetry
  WHERE machine_id = 'MCH-LS-01'
  ORDER BY timestamp DESC
  LIMIT 200;
  ```
