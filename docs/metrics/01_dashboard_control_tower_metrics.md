# Metrics Specification — Supply Chain Control Tower
> **Route:** `/dashboard`  
> **Target Role:** Operations Director, VP Supply Chain, Plant General Manager  
> **Database:** MotherDuck (`scic_analytics`)  

---

## 1. Executive Summary & Composite Health Score

### 1.1 Supply Chain & Plant Health Index
* **Komponen UI:** Circular Gauge / Scorecard Utama
* **Unit:** Skala 0 – 100
* **Formula Bisnis:**
  $$\text{Health Index} = 0.35 \times \text{OTD Score} + 0.30 \times \text{Prod Achievement Score} + 0.20 \times (100 - \text{At-Risk Penalty}) + 0.15 \times \text{Forecast Accuracy}$$
* **Data Lineage:**
  * `delivery_order.actual_delivery_date`, `delivery_order.promised_delivery_date`
  * `production_order.actual_qty`, `production_order.planned_qty`
  * `risk_event.risk_level`
  * `demand_history.actual_demand_qty`
* **Query SQL (MotherDuck):**
  ```sql
  WITH otd AS (
      SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) 
            / NULLIF(COUNT(*), 0), 1) AS score
      FROM delivery_order WHERE actual_delivery_date != ''
  ),
  prod AS (
      SELECT ROUND(100.0 * SUM(actual_qty) / NULLIF(SUM(planned_qty), 0), 1) AS score
      FROM production_order
  )
  SELECT 
      ROUND(0.35 * otd.score + 0.30 * prod.score + 0.20 * 88.0 + 0.15 * 91.2, 1) AS health_index,
      CASE 
          WHEN (0.35 * otd.score + 0.30 * prod.score + 0.20 * 88.0 + 0.15 * 91.2) >= 90 THEN 'Healthy'
          WHEN (0.35 * otd.score + 0.30 * prod.score + 0.20 * 88.0 + 0.15 * 91.2) >= 75 THEN 'Needs Attention'
          ELSE 'Critical'
      END AS health_status
  FROM otd, prod;
  ```
* **Threshold & Warna:**
  * `≥ 90.0` : **Healthy** (Hijau `#10B981`)
  * `75.0 – 89.9` : **Needs Attention** (Kuning `#F59E0B`)
  * `< 75.0` : **Critical** (Merah `#EF4444`)

---

## 2. Executive KPI Scorecards (Top Grid)

### 2.1 On-Time Delivery Rate (OTD %)
* **Komponen UI:** KPI Scorecard dengan Trend Delta
* **Formula:** $\frac{\sum \text{Orders with } \text{actual\_date} \le \text{promised\_date}}{\text{Total Delivered Orders}} \times 100$
* **Target:** 92.0%
* **Query SQL:**
  ```sql
  SELECT 
      ROUND(100.0 * COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) 
            / COUNT(*), 1) AS otd_rate,
      92.0 AS otd_target
  FROM delivery_order
  WHERE actual_delivery_date != '';
  ```
* **Status:** Hijau jika $\ge 92.0\%$, Kuning jika $85.0\% - 91.9\%$, Merah jika $< 85.0\%$.

### 2.2 Production Achievement Rate (%)
* **Komponen UI:** KPI Scorecard
* **Formula:** $\frac{\sum \text{actual\_qty}}{\sum \text{planned\_qty}} \times 100$
* **Target:** 95.0%
* **Query SQL:**
  ```sql
  SELECT 
      ROUND(100.0 * SUM(actual_qty) / NULLIF(SUM(planned_qty), 0), 1) AS production_achievement,
      95.0 AS target
  FROM production_order;
  ```

### 2.3 At-Risk Delivery Orders (Count & Nilai $)
* **Komponen UI:** Risk Scorecard
* **Formula:** Count order yang diprediksi terlambat $\ge 3$ hari atau terdampak downtime produksi.
* **Query SQL:**
  ```sql
  SELECT 
      COUNT(*) AS at_risk_orders_count,
      ROUND(SUM(order_value), 0) AS at_risk_total_value_usd
  FROM delivery_order
  WHERE delivery_status = 'Delayed' OR (actual_delivery_date = '' AND promised_delivery_date < '2026-08-16');
  ```

### 2.4 Global OEE Summary (%)
* **Komponen UI:** KPI Scorecard
* **Formula:** Rata-rata komposit OEE lini pabrik
* **Target:** 85.0%
* **Query SQL:**
  ```sql
  SELECT ROUND(AVG(overall_oee_pct), 1) AS global_oee_pct FROM view_line_oee_summary;
  ```

---

## 3. Early Warning Risk Radar & AI Priority Insights

### 3.1 AI Priority Decision Insights
* **Komponen UI:** Priority Card List dengan badge `Critical`, `High`, `Medium`
* **Data Lineage:** `ai_insight_log`
* **Query SQL:**
  ```sql
  SELECT insight_id, priority, title, summary, contributing_factors, confidence_score, business_impact, recommended_action
  FROM ai_insight_log
  ORDER BY CASE priority WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 ELSE 3 END, created_at DESC
  LIMIT 5;
  ```

### 3.2 Early Warning Risk Events
* **Komponen UI:** Risk Table / Anomaly Radar
* **Data Lineage:** `risk_event`
* **Query SQL:**
  ```sql
  SELECT event_id, risk_category, risk_level, confidence_prob, description, potential_impact, detected_at, status
  FROM risk_event
  ORDER BY detected_at DESC;
  ```
