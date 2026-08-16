# SCIC Unified Data Model — Entity Relationship Documentation
> **Platform Target:** MotherDuck (DuckDB Cloud OLAP) & Supabase PostgreSQL  
> **Total Tables:** 34 Tables (16 Core Supply Chain + 18 Manufacturing Quick Win)  
> **Visual Reference:** [`docs/diagrams/scic_unified_data_model.png`](file:///d:/Project%20Coding/scic-indoprima/docs/diagrams/scic_unified_data_model.png)  
> **Mermaid Definition:** [`docs/scic_unified_erd.mmd`](file:///d:/Project%20Coding/scic-indoprima/docs/scic_unified_erd.mmd)  

---

## 1. Overview

Data model terpadu SCIC menggabungkan dua domain besar:
1. **Supply Chain & Logistics Network (16 Tabel)**: Mengelola multi-sistem harmonisasi supplier & produk, rekonsiliasi faktur 3-arah (PO ↔ Invoice ↔ Surat Jalan), pemenuhan order pengiriman (OTD), histori demand SKU per cabang, dan modul rekomendasi relokasi stok antar-cabang (Stock Balancing).
2. **Shopfloor Manufacturing & Predictive Maintenance (18 Tabel)**: Mengelola master pabrik, lini produksi, aset mesin, standar cycle time SKU manufaktur, log downtime (6 Big Losses), output produksi per shift, inspeksi kualitas QC, kesiapan suku cadang MRO (Smart ROP), riwayat work order, dan telemetri sensor IoT (vibration, temp, current, rpm).

---

## 2. Module 1: Master Data Harmonization (Golden Record)

| Table | Primary Key | Description |
|---|---|---|
| `supplier_master` | `supplier_id` | 10 Supplier × 3 Sistem Asal (ERP, WMS, Portal) dihubungkan lewat `tax_id` menuju `harmonized_supplier_name`. |
| `product_master` | `product_id` | 15 Produk SKU × 3 Sistem Asal diharmonisasikan menuju `harmonized_product_name` & `harmonized_uom`. |
| `plant_master` | `plant_id` | Master fasilitas rantai pasok (Pabrik Surabaya, Pabrik Karawang, Gudang Distribusi Surabaya, Gudang Sentral Karawang). |
| `dim_factories` | `factory_id` | Master pabrik manufaktur pegas (`FB-GRS` Gresik, `FB-NGJ` Nganjuk). |
| `dim_production_lines`| `line_id` | Master lini produksi (`LINE-LS-01`, `LINE-LS-02`, `LINE-CS-01`, `LINE-SB-01`). |
| `dim_machines` | `machine_id` | Master 8 mesin utama beserta status instrumentasi IoT sensor. |
| `dim_skus` | `sku_id` | Master 6 SKU manufaktur pegas beserta ideal cycle time standar. |
| `dim_spare_parts` | `part_id` | Master 10 suku cadang kritis MRO (Bearing, Seal, Sensor, Heating Element) beserta lead time & level min/max. |
| `dim_bom_compatibility`| `bom_id` | Matriks pemetaan kecocokan part terhadap aset mesin tertentu. |

---

## 3. Module 2: Invoice Matching Intelligence (3-Way Triad)

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `supplier_master` → `purchase_order` | FK | `supplier_id` | 1 : N |
| `product_master` → `purchase_order` | FK | `product_id` | 1 : N |
| `plant_master` → `purchase_order` | FK | `plant_id` | 1 : N |
| `purchase_order` → `invoice` | Join / Ref | `po_number` | 1 : 1 |
| `purchase_order` → `shipment_resi` | Join / Ref | `po_number` | 1 : 1 |

---

## 4. Module 3: Manufacturing Productivity & OEE (Shopfloor)

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `dim_factories` → `dim_production_lines` | FK | `factory_id` | 1 : N |
| `dim_production_lines` → `dim_machines` | FK | `line_id` | 1 : N |
| `dim_production_lines` → `fact_shift_manpower` | FK | `line_id` | 1 : N |
| `dim_machines` → `fact_production_schedules` | FK | `machine_id` | 1 : N |
| `dim_skus` → `fact_production_schedules` | FK | `sku_id` | 1 : N |
| `dim_machines` → `fact_downtime_logs` | FK | `machine_id` | 1 : N |
| `dim_machines` → `fact_production_outputs` | FK | `machine_id` | 1 : N |
| `dim_skus` → `fact_production_outputs` | FK | `sku_id` | 1 : N |
| `dim_machines` → `fact_quality_inspections` | FK | `machine_id` | 1 : N |
| `dim_skus` → `fact_quality_inspections` | FK | `sku_id` | 1 : N |

---

## 5. Module 4: Supply Chain Delivery & Logistik Ekspor

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `plant_master` → `production_order` | FK | `plant_id` | 1 : N |
| `product_master` → `production_order` | FK | `product_id` | 1 : N |
| `product_master` → `delivery_order` | FK | `product_id` | 1 : N |
| `plant_master` → `delivery_order` | FK | `plant_id` | 1 : N |
| `delivery_order` → `logistics_telemetry` | Contextual | Port code | N : N |

---

## 6. Module 5: Demand Forecasting & Stock Balancing

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `product_master` → `demand_history` | FK | `sku_id` | 1 : N (12 bulan historis per SKU) |
| `product_master` → `demand_history_per_branch` | FK | `sku_id` | 1 : N (390 baris konsumsi cabang) |
| `plant_master` → `demand_history_per_branch` | FK | `warehouse_id` | 1 : N |
| `product_master` → `inventory_snapshot` | FK | `sku_id` | 1 : N |
| `plant_master` → `inventory_snapshot` | FK | `warehouse_id` | 1 : N |
| `product_master` → `branch_transfer_log` | FK | `sku_id` | 1 : N (29 transaksi relokasi) |

---

## 7. Module 6: Spare Part Readiness & Work Orders

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `dim_spare_parts` → `fact_part_consumptions` | FK | `part_id` | 1 : N |
| `dim_machines` → `fact_part_consumptions` | FK | `machine_id` | 1 : N |
| `dim_spare_parts` → `fact_inventory_snapshots` | FK | `part_id` | 1 : N |
| `dim_spare_parts` → `fact_purchase_orders` | FK | `part_id` | 1 : N |
| `dim_machines` → `fact_work_orders` | FK | `machine_id` | 1 : N |
| `fact_work_orders` → `fact_work_order_parts` | FK | `work_order_id` | 1 : N |
| `dim_spare_parts` → `fact_work_order_parts` | FK | `part_id` | 1 : N |

---

## 8. Module 7: IoT Telemetry & Anomaly Detection

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `dim_machines` → `fact_machine_telemetry` | FK | `machine_id` | 1 : N (5.040 data point getaran, suhu, arus, RPM) |
| `dim_machines` → `fact_anomaly_events` | FK | `machine_id` | 1 : N (36 deteksi sinyal anomali) |

---

## 9. Module 8: AI Intelligence & Human-in-the-Loop Governance

| Relationship | Type | Key | Cardinality |
|---|---|---|---|
| `risk_event` → `production_order` / `delivery_order` | Contextual | `related_entity_ids` | N : N |
| `ai_insight_log` → `risk_event` | Reference | `contributing_factors` | N : N |
| `ai_insight_log` → `branch_transfer_log` | Recommendation | `ai_recommendation_id` | N : 1 |
| `audit_log` → `ai_insight_log` / `branch_transfer_log` | Approval | `entity_id` | N : 1 |
