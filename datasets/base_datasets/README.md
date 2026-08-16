# SCIC Dummy Data — Dataset Documentation

## Overview

This directory contains 14 CSV files representing the complete dummy dataset for the Supply Chain Intelligence Center (SCIC) MVP. All files follow the schema defined in the Technical Data Specification v0.1 and are designed for direct loading into DuckDB for OLAP querying.

**Total:** 1,010 data rows across 14 files, covering 4 simulated source systems (SAP S/4HANA ERP, Indoprima WMS, E-Procurement Supplier Portal, Tanjung Perak Port Customs Telemetry).

---

## File Inventory

| # | File Name | Source System | Rows | Columns | Purpose |
|---|-----------|--------------|------|---------|---------|
| 1 | `supplier_master.csv` | ERP + WMS + Portal | 30 | 6 | Supplier golden record with 3 system representations per supplier |
| 2 | `product_master.csv` | ERP + WMS + Portal | 45 | 8 | Product master with harmonized taxonomy |
| 3 | `plant_master.csv` | ERP | 5 | 4 | Facility/plant reference |
| 4 | `purchase_order.csv` | E-Procurement Portal | 150 | 9 | PO transactions (Open/Closed) |
| 5 | `invoice.csv` | SAP S/4HANA ERP | 150 | 10 | Invoice records linked to POs |
| 6 | `shipment_resi.csv` | Indoprima WMS | 150 | 10 | Warehouse receiving records |
| 7 | `production_order.csv` | SAP S/4HANA ERP | 80 | 12 | Production orders with downtime |
| 8 | `delivery_order.csv` | ERP + WMS | 120 | 9 | Delivery orders for OTD calculation |
| 9 | `logistics_telemetry.csv` | Port Customs | 40 | 6 | Export logistics tracking |
| 10 | `demand_history.csv` | ERP Sales/Demand | 180 | 4 | 12-month demand per SKU |
| 11 | `inventory_snapshot.csv` | Indoprima WMS | 30 | 7 | Current inventory positions |
| 12 | `risk_event.csv` | AI Engine | 12 | 9 | Early Warning events |
| 13 | `ai_insight_log.csv` | AI Engine | 10 | 10 | AI Priority Insights |
| 14 | `audit_log.csv` | Human-in-the-Loop | 8 | 7 | Decision audit trail |

---

## Key Scenarios Embedded

### 1. Invoice Matching Discrepancies
- 5% of invoices have quantity discrepancies (95% of PO qty)
- 3.3% of invoices have amount mismatches
- Short-shipped receipts (92% of PO qty) for ~4% of shipments
- UOM conversion differences between systems (BOX vs PCS)

### 2. Production Underperformance
- ~7% of production orders show significant underperformance (75-88% achievement)
- ~10% show minor underperformance (90-96%)
- Downtime reasons include hydraulic failure, material shortage, machine breakdown

### 3. Delivery Delays
- ~15% of delivered orders are late (actual > promised date)
- ~10% still in transit (no actual delivery date)
- ~75% delivered on time or early

### 4. Inventory Stockout Risk
- 15% of inventory snapshots show low stock (below safety stock)
- Brake Pad 08 Aluminum projected stockout on 18 Aug 2026
- Overstock scenario at Karawang warehouse for Gasket G-400

### 5. Risk Events & AI Insights
- 2 Critical events (equipment failure, supplier compliance)
- 4 High events (supply chain delay, stockout, demand surge, logistics)
- 4 Medium events (quality defect, supplier risk, cost escalation)
- 2 Low events (overstock, sensor anomaly)

---

## Module 6: Stock Balancing Recommendation (Inter-Branch Transfer)

The dataset now fully supports the "Rekomendasi Relokasi Stok Antar-Pabrik" narrative with:

- **inventory_snapshot** expanded with `unit_cost_usd`, `inventory_value_usd`, `holding_cost_month_usd`, `avg_monthly_consumption`, `days_of_supply`, `velocity_category`, `aging_days`, `stock_status`
- **demand_history_per_branch.csv** (NEW) — 390 rows: monthly demand per SKU per warehouse with trend detection
- **branch_transfer_log.csv** (NEW) — 29 rows: 25 historical completed transfers + 4 pending AI-recommended transfers
- **5 SKUs** with clear overstock-at-KRW + crisis-at-SBY patterns (Fastener, Brake Pad, Bearing, Shock Absorber, Gasket)
- **4 AI insights** (INS-005 to INS-008) specifically recommending inter-branch transfers
- **4 human approvals** (AUD-006 to AUD-009) showing the human-in-the-loop workflow
- **7 risk events** (RE-008 to RE-014) about inventory imbalance across branches
- Combined imbalanced inventory value: **Rp ~23.3 Miliar** (slow/dead-moving stock at Karawang)

### Sample Stock Balancing Query
```sql
-- Identify stock imbalance candidates
SELECT sku_id, product_name,
       MAX(CASE WHEN warehouse_id='WHS-KRW-01' THEN on_hand_qty END) as krw_qty,
       MAX(CASE WHEN warehouse_id='WHS-SBY-01' THEN on_hand_qty END) as sby_qty,
       MAX(CASE WHEN warehouse_id='WHS-KRW-01' THEN days_of_supply END) as krw_dos,
       MAX(CASE WHEN warehouse_id='WHS-SBY-01' THEN days_of_supply END) as sby_dos
FROM inventory_snapshot
WHERE sku_id IN ('PRD-001','PRD-002','PRD-006','PRD-009')
GROUP BY sku_id, product_name
HAVING MAX(CASE WHEN warehouse_id='WHS-KRW-01' THEN days_of_supply END) > 90
   AND MAX(CASE WHEN warehouse_id='WHS-SBY-01' THEN days_of_supply END) < 30;

-- Total imbalanced inventory value
SELECT ROUND(SUM(inventory_value_usd * 14500), 0) as total_idr
FROM inventory_snapshot
WHERE velocity_category IN ('dead-moving', 'slow-moving')
  AND warehouse_id = 'WHS-KRW-01';
```

---

## Loading into DuckDB

```python
import duckdb

con = duckdb.connect("scic_olap.duckdb")

# Load all CSVs
import glob, os
for csv_file in glob.glob("scic_dummy_data/*.csv"):
    table_name = os.path.basename(csv_file).replace(".csv", "")
    con.execute(f"CREATE TABLE {table_name} AS SELECT * FROM read_csv_auto('{csv_file}')")

# Example: On-Time Delivery Rate
result = con.execute("""
    SELECT 
        COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) as on_time,
        COUNT(*) as total_delivered,
        ROUND(100.0 * COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) 
              / NULLIF(COUNT(*), 0), 1) as otd_rate
    FROM delivery_order
    WHERE actual_delivery_date != ''
""").fetchall()

# Example: Production Achievement per Plant
result = con.execute("""
    SELECT plant_id, 
           ROUND(100.0 * SUM(actual_qty) / NULLIF(SUM(planned_qty), 0), 1) as achievement_pct
    FROM production_order
    GROUP BY plant_id
""").fetchall()

# Example: Supply Chain Health Index
result = con.execute("""
    WITH otd AS (
        SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE actual_delivery_date <= promised_delivery_date) 
              / NULLIF(COUNT(*), 0), 1) as score
        FROM delivery_order WHERE actual_delivery_date != ''
    ),
    prod AS (
        SELECT ROUND(100.0 * SUM(actual_qty) / NULLIF(SUM(planned_qty), 0), 1) as score
        FROM production_order
    )
    SELECT 0.35 * otd.score + 0.30 * prod.score + 0.20 * 90 + 0.15 * 85 as health_index
    FROM otd, prod
""").fetchall()
```

---

## Schema Notes

- **Harmonization fields** (marked `H` in spec) are pre-populated: `harmonized_supplier_name`, `harmonized_product_name`, `harmonized_uom`, `location_code`
- **Cross-references** use consistent keys: `po_number` links PO → Invoice → Shipment Resi
- **Date formats:** ISO 8601 (`YYYY-MM-DD` or `YYYY-MM` for monthly periods)
- **Currency:** USD for demo (spec notes IDR for production)
- **Empty values:** Empty strings for optional/null fields (e.g., `downtime_reason`, `actual_delivery_date` for in-transit)
