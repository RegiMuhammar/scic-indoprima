# Metrics Specification — Demand & Inventory Decision Intelligence
> **Route:** `/demand-intelligence`  
> **Target Role:** Demand Planner, Inventory Manager, Procurement Buyer, Maintenance Lead  
> **Database:** MotherDuck (`scic_analytics.supply_chain` & `scic_analytics.manufacturing`)  

---

## 1. Demand Forecasting & Uncertainty Metrics

### 1.1 Forecast Value & Uncertainty Band (90% Confidence)
* **Komponen UI:** Time-Series Line Chart with Area Range (Uncertainty Band)
* **Horizon:** 30 / 60 / 90 Hari
* **Formula:**
  $$ \text{Forecast}_t = \text{Model}(\text{Historical Series}) $$
  $$ \text{Uncertainty Band} = \text{Forecast}_t \pm 1.28 \times \sigma_{\text{residual}} $$
* **Data Lineage:** `demand_history`, `demand_history_per_branch`
* **Query SQL (Histori Konsumsi):**
  ```sql
  SELECT period, SUM(actual_demand_qty) AS monthly_demand_qty
  FROM demand_history
  WHERE sku_id = 'PRD-001'
  GROUP BY period
  ORDER BY period;
  ```

### 1.2 Forecast Accuracy (MAPE)
* **Formula:** $100 - \text{MAPE}$, dengan $\text{MAPE} = \frac{1}{n} \sum \left| \frac{\text{Actual} - \text{Forecast}}{\text{Actual}} \right| \times 100$
* **Target:** $\ge 90.0\%$

---

## 2. Inventory Health & Stockout Risk

### 2.1 Days of Supply (DOS)
* **Formula:** $\frac{\text{On-Hand Quantity}}{\text{Average Daily Demand}}$
* **Threshold & Status:**
  * `> 90 Hari` : **Overstock Risk** (Warna Kuning/Oranye)
  * `30 – 90 Hari` : **Healthy Stock** (Warna Hijau)
  * `15 – 29 Hari` : **Low Stock / Warning** (Warna Kuning)
  * `< 15 Hari (≤ Lead Time)` : **Critical Stockout Risk** (Warna Merah)
* **Query SQL:**
  ```sql
  SELECT sku_id, warehouse_id, on_hand_qty, days_of_supply, stock_status, velocity_category, inventory_value_usd
  FROM inventory_snapshot
  ORDER BY days_of_supply ASC;
  ```

### 2.2 Projected Stockout Date
* **Formula:** Tanggal di mana $(\text{On-Hand Stock} - \sum \text{Forecast Demand}) \le \text{Safety Stock}$

---

## 3. Stock Balancing (Relokasi Antar-Gudang)

### 3.1 Kandidat Relokasi & Valuasi Ketidakseimbangan (Rp 23,3 Miliar)
* **Komponen UI:** Stock Balancing Transfer Matrix Card
* **Kriteria Trigger:**
  * Gudang A (mis. Karawang `WHS-KRW-01`): $\text{DOS} > 90\text{ hari}$ (*Dead/Slow-Moving Stock*).
  * Gudang B (mis. Surabaya `WHS-SBY-01`): $\text{DOS} < 30\text{ hari}$ (*Krisis Stockout*).
* **Query SQL Identifikasi Kandidat:**
  ```sql
  SELECT 
      a.sku_id, 
      a.warehouse_name AS source_warehouse,
      a.on_hand_qty AS source_qty,
      a.days_of_supply AS source_dos,
      b.warehouse_name AS destination_warehouse,
      b.on_hand_qty AS destination_qty,
      b.days_of_supply AS destination_dos,
      ROUND((a.inventory_value_usd + b.inventory_value_usd) * 15500, 0) AS total_imbalance_value_idr
  FROM inventory_snapshot a
  JOIN inventory_snapshot b ON a.sku_id = b.sku_id AND a.warehouse_id != b.warehouse_id
  WHERE a.days_of_supply > 90 AND b.days_of_supply < 30;
  ```

---

## 4. Spare Part Readiness (Suku Cadang MRO)

### 4.1 Smart Reorder Point AI (ROP)
* **Formula:**
  $$ \text{Smart ROP} = (\text{Avg Daily Part Consumption} \times \text{Supplier Lead Time}) + \text{Dynamic Safety Stock Buffer} $$
* **Query SQL:**
  ```sql
  SELECT 
      p.part_id,
      p.part_name,
      p.criticality_level,
      s.current_stock_qty,
      s.available_stock_qty,
      s.smart_reorder_point_ai,
      s.is_reorder_triggered,
      p.default_supplier_lead_time_days
  FROM fact_inventory_snapshots s
  JOIN dim_spare_parts p ON s.part_id = p.part_id
  WHERE s.snapshot_date = '2026-07-30' AND s.is_reorder_triggered = true;
  ```
* **Predictive Maintenance Pre-positioning:** Jika `fact_anomaly_events.severity_level = 'Critical'`, AI merekomendasikan pre-order suku cadang sebelum mesin mengalami kerusakan total.

---

## 5. Interactive Scenario Simulator

### 5.1 Real-Time Recalculated Replenishment Formula
$$ \text{Recalculated Qty} = \text{Suggested Qty}_{\text{base}} \times (1 + \text{Demand Surge \%}) + (\text{Daily Demand} \times \text{Lead Time Delay Days}) $$
* **Slider Controls:**
  * Demand Surge: `-20%` s/d `+40%`
  * Supplier Lead Time Delay: `0` s/d `14` hari
