# Supply Chain Intelligence Center (SCIC) — Datasets Documentation

Dokumentasi seluruh dataset dummy terstruktur untuk pengembangan dan pengujian platform SCIC PT Indoprima & PT Indospring Tbk. Seluruh dataset didesain untuk di-load ke **MotherDuck (DuckDB Cloud OLAP)** dan terintegrasi dengan **Supabase PostgreSQL**.

---

## 📂 Struktur Direktori Dataset

```
datasets/
├── base_datasets/                 # Kumpulan mentah 16 tabel Supply Chain dasar + skema ERD
├── inventory/                     # Snapshot inventaris finished goods & log relokasi stok antar-cabang
│   ├── inventory_snapshot.csv     # Snapshot stok, days of supply, status, dan valuasi USD
│   └── branch_transfer_log.csv    # Riwayat dan rekomendasi transfer stok antar-gudang
├── invoices/                      # Data rekonsiliasi keuangan 3 arah (Invoice Matching)
│   ├── invoice.csv                # Data invoice SAP ERP
│   └── shipment_resi.csv          # Surat jalan/resi penerimaan dock WMS
├── demand_history/                # Histori demand time-series per SKU dan per cabang
│   ├── demand_history.csv         # Histori demand 12 bulan per SKU
│   └── demand_history_per_branch.csv # Histori konsumsi per gudang/cabang
├── procurement/                   # Master data supplier dan purchase order
│   ├── purchase_order.csv         # Data PO transaksi dari E-Procurement Portal
│   └── supplier_master.csv        # Golden record supplier (3 representasi sistem asal)
├── erp_master/                    # Master referensi sistem ERP, produksi & logistik ekspor
│   ├── plant_master.csv           # Master fasilitas pabrik & gudang distribusi
│   ├── product_master.csv         # Master produk dengan taksonomi terharmonisasi
│   ├── production_order.csv       # Order produksi dengan pencatatan downtime
│   ├── delivery_order.csv         # Order pengiriman untuk kalkulasi On-Time Delivery (OTD)
│   └── logistics_telemetry.csv    # Telemetri kepabeanan pelabuhan (Tanjung Perak)
├── ai_governance/                 # Rekam jejak AI Engine & Human-in-the-Loop
│   ├── risk_event.csv             # Log deteksi risiko & early warning signals
│   ├── ai_insight_log.csv         # Rekomendasi prioritas AI dengan confidence score
│   └── audit_log.csv              # Audit trail immutable atas keputusan human
└── quickwin_manufacturing/        # 18 Tabel Quick Win Manufacturing (OEE & Spare Part Readiness)
    ├── dim_factories.csv          # Master pabrik (Gresik, Nganjuk)
    ├── dim_production_lines.csv   # Master lini produksi (Leaf Spring, Coil Spring, Stabilizer)
    ├── dim_machines.csv           # Master mesin & status instrumentasi sensor
    ├── dim_skus.csv               # Master SKU manufaktur & ideal cycle time
    ├── dim_spare_parts.csv        # Master spare part kritis & lead time supplier
    ├── dim_bom_compatibility.csv  # Matriks kompatibilitas part terhadap mesin
    ├── fact_production_schedules.csv # Jadwal produksi terencana per shift
    ├── fact_downtime_logs.csv     # Log downtime mesin (breakdown, changeover, planned)
    ├── fact_production_outputs.csv# Output produksi aktual & analisis speed loss
    ├── fact_quality_inspections.csv # Inspeksi QC, good count, defect & rework
    ├── fact_shift_manpower.csv    # Alokasi manpower & jam kerja efektif per shift
    ├── fact_part_consumptions.csv # Konsumsi historis spare part per work order
    ├── fact_inventory_snapshots.csv # Snapshot stok spare part & smart reorder point AI
    ├── fact_purchase_orders.csv   # PO pengadaan spare part & lead time aktual
    ├── fact_work_orders.csv       # Riwayat perbaikan & work order maintenance
    ├── fact_work_order_parts.csv  # Suku cadang yang dipakai per work order
    ├── fact_machine_telemetry.csv # Sinyal sensor IoT (vibration, temp, current, rpm)
    └── fact_anomaly_events.csv    # Deteksi anomali telemetri sensor sebelum breakdown
```

---

## 📊 Ringkasan Data & Coverage

| Kategori Dataset | Total Tabel | Total Records | Sumber Sistem Representasi |
|---|---|---|---|
| **Core Supply Chain & Distribution** | 16 Tabel | ~1.400 Baris | SAP S/4HANA ERP, Indoprima WMS, E-Procurement Portal, Tanjung Perak Port |
| **Manufacturing OEE & Spare Parts** | 18 Tabel | ~8.000 Baris | Shopfloor SCADA/PLC, IoT Vibration/Thermal Sensors, Indospring CMMS & MES |
| **Total Keseluruhan** | **34 Tabel** | **~9.400 Baris** | End-to-End Manufaktur Otomotif & Rantai Pasok |
