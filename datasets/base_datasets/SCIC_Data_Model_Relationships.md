# SCIC Data Model — Entity Relationship Documentation

## Overview

The SCIC dataset consists of **16 tables** organized into 5 functional modules. Three master data tables serve as the foundation, referenced by transactional tables across all modules. The AI-generated tables form a top-level chain that aggregates insights from the raw operational data.

A new **Stock Balancing Module** has been added (Module 5) to support the "Rekomendasi Relokasi Stok Antar-Pabrik" narrative, introducing the `branch_transfer_log` table and expanding `inventory_snapshot` and `demand_history_per_branch` with financial valuation and per-branch demand tracking.

---

## Module 1: Master Data (Reference Tables)

| Table | Primary Key | Row Count | Description |
|-------|-------------|-----------|-------------|
| `supplier_master` | `supplier_id` | 30 | 10 suppliers x 3 source systems (ERP, WMS, Portal). Contains harmonization fields (`harmonized_supplier_id`, `harmonized_supplier_name`) for cross-system matching. |
| `product_master` | `product_id` | 45 | 15 products x 3 source systems. Contains harmonized taxonomy (`harmonized_product_name`, `harmonized_uom`) for standardizing product codes and units. |
| `plant_master` | `plant_id` | 5 | Facility reference: 3 plants + 2 warehouses. Includes `location_code` for cross-system location mapping. |

---

## Module 2: Invoice Matching Intelligence

The Invoice Matching module revolves around the **triad** of Purchase Order, Invoice, and Shipment Resi — all linked by `po_number`.

| Relationship | Type | Key | Cardinality |
|-------------|------|-----|-------------|
| `supplier_master` → `purchase_order` | FK | `supplier_id` | 1:N |
| `product_master` → `purchase_order` | FK | `product_id` | 1:N |
| `plant_master` → `purchase_order` | FK | `plant_id` | 1:N |
| `purchase_order` → `invoice` | Join | `po_number` | 1:1 |
| `supplier_master` → `invoice` | FK | `supplier_id` | 1:N |
| `product_master` → `invoice` | FK | `product_id` | 1:N |
| `purchase_order` → `shipment_resi` | Join | `po_number` | 1:1 |
| `supplier_master` → `shipment_resi` | FK | `supplier_id` | 1:N |
| `product_master` → `shipment_resi` | FK | `product_id` | 1:N |

---

## Module 3: Production & Delivery (Dashboard)

| Relationship | Type | Key | Cardinality |
|-------------|------|-----|-------------|
| `plant_master` → `production_order` | FK | `plant_id` | 1:N |
| `product_master` → `production_order` | FK | `product_id` | 1:N |
| `product_master` → `delivery_order` | FK | `product_id` | 1:N |
| `plant_master` → `delivery_order` | FK | `plant_id` | 1:N |
| `delivery_order` → `logistics_telemetry` | Contextual | port/shipment | N:N (indirect) |

---

## Module 4: Demand & Inventory Decision Intelligence

| Relationship | Type | Key | Cardinality |
|-------------|------|-----|-------------|
| `product_master` → `demand_history` | FK | `sku_id` | 1:N (12 months per SKU) |
| `product_master` → `demand_history_per_branch` | FK | `sku_id` | 1:N (NEW) |
| `plant_master` → `demand_history_per_branch` | FK | `warehouse_id` | 1:N (NEW) |
| `product_master` → `inventory_snapshot` | FK | `sku_id` | 1:N |
| `plant_master` → `inventory_snapshot` | FK | `warehouse_id` | 1:N |

### Expanded Fields (Stock Balancing Support)

The `inventory_snapshot` table has been expanded with 9 new fields to enable financial valuation and velocity analysis:

| New Field | Type | Purpose |
|-----------|------|---------|
| `unit_cost_usd` | float | Per-unit cost for inventory valuation |
| `inventory_value_usd` | float | Total on-hand value (qty x unit_cost) |
| `holding_cost_month_usd` | float | Monthly carrying cost (~1.5% of inventory value) |
| `avg_monthly_consumption` | int | Average monthly demand at this warehouse |
| `days_of_supply` | float | On-hand quantity / daily consumption rate |
| `velocity_category` | string | Classification: `fast-moving`, `normal`, `slow-moving`, `dead-moving` |
| `last_movement_date` | date | Last date the SKU moved in/out of this warehouse |
| `aging_days` | int | Days since last movement |
| `stock_status` | string | Classification: `healthy`, `low`, `critical_low`, `overstock` |

The `demand_history_per_branch` table is a **new** table providing per-warehouse demand granularity:

| Field | Type | Description |
|-------|------|-------------|
| `sku_id` | string (FK) | Links to `product_master` |
| `warehouse_id` | string (FK) | Links to `plant_master` |
| `period` | string | Month in YYYY-MM format |
| `actual_consumption_qty` | int | Units consumed at this warehouse in this month |
| `avg_daily_consumption` | float | Daily average (consumption / 30) |
| `trend_direction` | string | `increasing`, `decreasing`, or `stable` |
| `demand_variability` | float | Coefficient of variation (CV) for forecast confidence |

---

## Module 5: Stock Balancing Recommendation (Inter-Branch Transfer) — NEW

This module supports the AI-driven recommendation of inter-branch stock transfers to resolve overstock/dead-stock at one warehouse and stockout/crisis at another.

| Relationship | Type | Key | Cardinality |
|-------------|------|-----|-------------|
| `product_master` → `branch_transfer_log` | FK | `sku_id` | 1:N |
| `ai_insight_log` → `branch_transfer_log` | Recommendation | `ai_recommendation_id` | N:1 |
| `audit_log` → `branch_transfer_log` | Approval | `transfer_id` | N:1 |

### `branch_transfer_log` Table (NEW)

| Field | Type | Description |
|-------|------|-------------|
| `transfer_id` | string (PK) | Unique transfer identifier (e.g., TRF-2026-0026) |
| `sku_id` | string (FK) | Product being transferred |
| `product_name` | string | Human-readable product name |
| `source_warehouse` | string | Origin warehouse (e.g., WHS-KRW-01) |
| `destination_warehouse` | string | Target warehouse (e.g., WHS-SBY-01) |
| `transfer_qty` | int | Number of units to transfer |
| `unit_cost_usd` | float | Per-unit cost |
| `transfer_value_usd` | float | Total transfer value |
| `reason` | string | Transfer justification |
| `requested_by` | string | Requestor (e.g., "AI System (Auto)") |
| `requested_date` | date | Date transfer was initiated |
| `approved_date` | date | Date of human approval (empty if pending) |
| `completed_date` | date | Date transfer was executed |
| `status` | string | `Completed`, `In Transit`, `Pending Approval` |
| `transport_days` | int | Estimated/actual transit duration |
| `transport_cost_usd` | float | Logistics cost for the transfer |
| `trigger_type` | string | `AI Recommendation` or `Manual Request` |
| `ai_recommendation_id` | string (FK) | Links back to the AI insight that triggered it |

### Stock Balancing Flow

The module follows this workflow:

1. **Detection** — `risk_event` table flags inventory imbalance (e.g., RE-008 to RE-011)
2. **AI Recommendation** — `ai_insight_log` generates transfer recommendation (e.g., INS-005 to INS-008)
3. **Human Approval** — `audit_log` records decision (Approved/Rejected/Modified)
4. **Execution** — `branch_transfer_log` records the transfer with full financial tracking

---

## Module 6: AI Generated Data Chain

| Relationship | Type | Key | Cardinality |
|-------------|------|-----|-------------|
| `risk_event` → `production_order` | Reference | `related_entity_ids` | N:N |
| `risk_event` → `delivery_order` | Reference | `related_entity_ids` | N:N |
| `risk_event` → `supplier_master` | Reference | `related_entity_ids` | N:N |
| `risk_event` → `inventory_snapshot` | Reference | `related_entity_ids` | N:N (NEW) |
| `ai_insight_log` → `risk_event` | Reference | `contributing_factors` | N:N |
| `audit_log` → `ai_insight_log` | Reference | `original_ai_proposal` | N:1 |
| `ai_insight_log` → `branch_transfer_log` | Reference | `ai_recommendation_id` | N:1 (NEW) |
| `audit_log` → `branch_transfer_log` | Approval | — | N:1 (NEW) |

---

## Cross-System Harmonization Pattern

A unique aspect of this model is the multi-representation in master data. Each real-world supplier appears 3 times in `supplier_master` (once per source system), connected through the `tax_id` as the universal matching key. The same pattern applies to `product_master` where each product has 3 representations with different codes and UOMs, harmonized into a golden record.

---

## DuckDB OLAP Query Examples

### 3-Way Invoice Matching Join
```sql
SELECT po.po_number, po.po_qty, inv.invoiced_qty, resi.received_qty,
       inv.invoice_amount, po.po_amount
FROM purchase_order po
JOIN invoice inv ON po.po_number = inv.po_number
JOIN shipment_resi resi ON po.po_number = resi.po_number;
```

### Stock Balancing: Identify Transfer Candidates
```sql
SELECT a.sku_id, pm.harmonized_product_name,
       a.on_hand_qty AS krw_qty, a.days_of_supply AS krw_dos,
       a.velocity_category AS krw_velocity,
       a.inventory_value_usd AS krw_value,
       b.on_hand_qty AS sby_qty, b.days_of_supply AS sby_dos,
       b.velocity_category AS sby_velocity,
       b.stock_status AS sby_status,
       a.inventory_value_usd + b.inventory_value_usd AS total_imbalance_value
FROM inventory_snapshot a
JOIN inventory_snapshot b ON a.sku_id = b.sku_id AND a.warehouse_id < b.warehouse_id
JOIN product_master pm ON a.sku_id = pm.product_id AND pm.source_system = 'SAP_S4HANA_ERP'
WHERE a.days_of_supply > 90
  AND b.days_of_supply < 30
  AND a.warehouse_id = 'WHS-KRW-01'
  AND b.warehouse_id = 'WHS-SBY-01';
```

### On-Time Delivery Rate
```sql
SELECT 
  ROUND(100.0 * COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) 
        / COUNT(*), 1) AS otd_rate
FROM delivery_order
WHERE actual_delivery_date != '';
```

### Supply Chain Health Index
```sql
SELECT 
  0.35 * otd_score + 0.30 * prod_score + 0.20 * forecast_score + 0.15 * at_risk_score
  AS health_index
FROM (
  SELECT
    (SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) / COUNT(*), 1)
     FROM delivery_order WHERE actual_delivery_date != '') AS otd_score,
    (SELECT ROUND(100.0 * SUM(actual_qty) / SUM(planned_qty), 1)
     FROM production_order) AS prod_score,
    84 AS forecast_score,
    (SELECT ROUND(100.0 * (1 - COUNT(*) FILTER (WHERE delivery_status != 'Completed' AND actual_delivery_date != '') / 
                  NULLIF(COUNT(*), 0)), 1)
     FROM delivery_order) AS at_risk_score
) t;
```

### Total Imbalanced Inventory Value (Stock Balancing)
```sql
SELECT 
  warehouse_id,
  ROUND(SUM(inventory_value_usd), 2) AS total_usd,
  ROUND(SUM(inventory_value_usd * 14500), 0) AS total_idr,
  COUNT(*) FILTER (WHERE velocity_category = 'dead-moving') AS dead_moving_skus,
  COUNT(*) FILTER (WHERE velocity_category = 'slow-moving') AS slow_moving_skus,
  ROUND(SUM(holding_cost_month_usd), 2) AS total_monthly_holding_cost
FROM inventory_snapshot
WHERE velocity_category IN ('dead-moving', 'slow-moving')
GROUP BY warehouse_id;
```
