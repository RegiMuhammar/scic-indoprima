# Supply Chain Intelligence Center (SCIC) — PT Indoprima
# Project Progress & Context Reference Document

> **Dokumen Status & Konteks Antar-Sesi Coding Agent**  
> **Terakhir Diperbarui:** 17 Agustus 2026  
> **Klien:** PT Indoprima Group & PT Indospring Tbk  
> **Status Keseluruhan:** Quick Win 1 (Manufacturing OEE) & Quick Win 2 (Demand & Spare Part) **100% SELESAI & LIVE**. Siap menuju implementasi **AI Agent Analytics (NL2SQL)**.

---

## 1. Ringkasan Eksekutif & Milestone Tracker

| Milestone / Modul | Deskripsi | Status | Rute UI | Backend API |
|---|---|:---:|---|---|
| **Data Foundation (MotherDuck)** | 34 Tabel OLAP Cloud (`manufacturing`, `supply_chain`, `finance`) | **✅ SELESAI** | - | MotherDuck Cloud |
| **Executive Control Tower** | Composite Health Score, 4 KPI Scorecards, Trend Chart, Risk Radar, Delivery Orders | **✅ SELESAI** | `/dashboard` | `/api/v1/dashboard/summary` |
| **Quick Win 1: Manufacturing Productivity** | OEE 3-Pillar (Avail, Perf, Qual), 6 Big Losses Pareto 80:20, Shift 1-3 Performance & Labor Fatigue | **✅ SELESAI** | `/dashboard` (Tab Plant OEE) | `/api/v1/dashboard/summary` |
| **Quick Win 2: Spare Part Readiness** | Smart Reorder Point (MRO), BOM Machine Compatibility Engine, Siklus Penggantian Part | **✅ SELESAI** | `/demand-intelligence` (Tab Suku Cadang) | `/api/v1/demand/summary` |
| **Quick Win 2: Demand & Balancing** | Time-Series Demand Forecasting (90% Uncertainty Band), Multi-Warehouse Stock Balancing (Surabaya vs Karawang) | **✅ SELESAI** | `/demand-intelligence` (Tab Forecasting) | `/api/v1/demand/summary` |
| **AI Agent Analytics (NL2SQL)** | Semantic Query Agent, Validasi AST SQLGlot, Schema Generator, Data-Augmented Synthesis | **🟡 NEXT (READY)** | `/chat` & Floating Drawer | `/api/v1/chat` |
| **Invoice Matching Intelligence** | 3-Way Matching (PO ↔ GR ↔ Invoice), Deteksi Selisih AI | **⚪ PLANNED** | `/invoice-matching` | `/api/v1/invoice` |
| **Data Connections & Health** | Health check sinkronisasi data MotherDuck, ERP, WMS, IoT | **⚪ PLANNED** | `/data-connections` | `/api/v1/data-connections` |
| **AI Explainability & Audit Log** | Trace tool-calling, confidence score transparency, model logs | **⚪ PLANNED** | `/agent-logs` & `/explainability` | `/api/v1/agent-logs` |

---

## 2. Arsitektur Sistem & Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 15 App Router)                 │
│   Tailwind CSS • Shadcn/UI • Recharts • Lucide Icons • TanStack Query   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST / JSON (Port 8000)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI + Python)                       │
│   Pydantic v2 • SQLGlot • LangGraph / LangChain • DuckDB Python Client  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ MotherDuck Connection Token (OLAP)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     MOTHERDUCK CLOUD DATA WAREHOUSE                     │
│   Schemas: manufacturing • supply_chain • finance (34 Live Tables)      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Environment & Cara Menjalankan
* **Frontend**:
  * Direktori: `/frontend`
  * Perintah: `npm run dev` (Berjalan di `http://localhost:3000`)
* **Backend**:
  * Direktori: `/backend`
  * Perintah: `uv run uvicorn app.main:app --port 8000 --host 0.0.0.0 --reload` (Berjalan di `http://localhost:8000`)
* **Database**:
  * MotherDuck Cloud terhubung via token di `.env` backend.

---

## 3. Detail Modul yang Sudah Rampung (Production-Ready)

### A. Executive Dashboard / Control Tower (`/dashboard`)
1. **Health Index Card**:
   - Skor komposit terbobot: $0.35 \times \text{OTD} + 0.30 \times \text{Prod} + 0.20 \times (100 - \text{Penalty}) + 0.15 \times \text{Forecast}$.
   - Interaktif dengan modal drilldown data lineage lengkap & penjelasan matematis.
2. **KPI Scorecards**:
   - On-Time Delivery (OTD), Production Achievement, At-Risk Orders, Global Plant OEE.
   - Tiap card memiliki modal penjelasan formula, sumber tabel SQL, akar penyebab (*underlying causes*), dan rekomendasi tindakan.
3. **KPI Trend Chart**:
   - Visualisasi tren OTD vs Production Achievement vs Target 90% sepanjang bulan.
4. **Early Warning Risk Radar**:
   - Deteksi risiko rantai pasok dan operasional manufaktur real-time berbasis probabilitas *confidence*.
5. **Live Delivery Orders Table**:
   - Pemantauan 15 pesanan pengiriman terbaru langsung dari tabel `supply_chain.delivery_order`.

### B. Quick Win 1: Manufacturing Productivity & OEE (`/dashboard` Tab Plant OEE)
1. **OEE 3-Pillar Breakdown per Lini**:
   - Availability, Performance, Quality dihitung per lini (`LINE-SPRING-01`, `LINE-SPRING-02`, `LINE-COIL-01`, `LINE-STAB-01`) pada Pabrik Gresik (`FB-GRS`) dan Pabrik Nganjuk (`FB-NGJ`).
   - Formula OEE: $(\text{Availability} \times \text{Performance} \times \text{Quality}) / 10000$.
   - Status badge otomatis (*Healthy* $\ge 85\%$, *On Track* $\ge 84\%$, *Warning* $< 84\%$).
2. **6 Big Losses Downtime Pareto (80:20 Rule)**:
   - Pengelompokan downtime: *Unplanned Breakdown*, *Changeover & Setup*, *Planned Maintenance*, *Tooling & Die Wear*, *Speed Loss*.
   - Grafik batang menit downtime + kurva persentase kumulatif (*cumulative percentage*).
3. **Shift Performance & Labor Utilization**:
   - Analisis performa Shift 1 (Pagi), Shift 2 (Siang), Shift 3 (Malam).
   - Metrik: *Target vs Actual Output, Defect Count, Downtime Minutes, Efficiency %*.
   - Deteksi lonjakan cacat pada shift malam akibat *worker fatigue*.

### C. Quick Win 2: Spare Part Readiness & Demand Intelligence (`/demand-intelligence`)
1. **Smart Reorder Point (ROP) Table**:
   - Manajemen suku cadang kritis (*Carbide Punch Die, Hydraulic Seal Kit, Heating Element Furnace, Shot Peening Wheel Blades, dll.*).
   - Perhitungan dinamis *Smart ROP* berbasis *Lead Time* supplier dan volatilitas konsumsi.
   - Status otomatis (*Perlu Pesan Ulang* [Merah] vs *Stok Aman* [Hijau]) dan perhitungan kuantitas pemesanan (*Suggested Order Quantity*).
2. **BOM & Machine Compatibility Viewer**:
   - Pemetaan kecocokan suku cadang terhadap aset mesin pabrik (*Hydraulic Stamping Press, Quenching Furnace, CNC Spring Coiler, Shot Peening Machine*).
   - Informasi siklus penggantian berkala (*replacement frequency days*) dan ketersediaan stok fisik.
3. **Time-Series Demand Forecasting**:
   - Peramalan permintaan spare part / finished goods: 12 bulan data historis aktual + 3-6 bulan proyeksi masa depan.
   - Dilengkapi *90% Uncertainty Confidence Band* (Upper & Lower Bound).
   - SKU Switcher interaktif untuk analisis per part.
4. **Multi-Warehouse Stock Balancing Matrix**:
   - Analisis sebaran stok antara **Pabrik Surabaya (SBY-01)** dan **Pusat Distribusi Karawang (KRW-01)**.
   - Deteksi *Overstock / Understock / Imbalanced* dan rekomendasi volume relokasi transfer stok antar-gudang.
5. **Demand KPI Scorecards**:
   - *Risiko Kehabisan Suku Cadang, Akurasi Peramalan (MAPE), Kesiapan Suku Cadang MRO, Valuasi Ketidakseimbangan Stok*.

---

## 4. Struktur Database MotherDuck (OLAP)

Terdapat 3 skema utama dengan 34 tabel yang sudah terisi data:

### 1. Skema `manufacturing`
- **Dimensi**: `dim_factories`, `dim_production_lines`, `dim_machines`, `dim_spare_parts`, `dim_bom_compatibility`, `dim_labor_shifts`.
- **Fakta**: `fact_production_schedules`, `fact_production_outputs`, `fact_downtime_logs`, `fact_iot_telemetry`, `fact_inventory_snapshots`, `fact_demand_forecasts`, `fact_warehouse_stocks`.

### 2. Skema `supply_chain`
- **Dimensi**: `vendor_master`, `product_master`, `customer_master`, `warehouse_master`, `plant_master`.
- **Fakta / Transaksi**: `delivery_order`, `shipment_tracking`, `risk_event`, `logistics_telemetry`, `inventory_levels`.

### 3. Skema `finance`
- **Fakta / Transaksi**: `purchase_order_header`, `purchase_order_item`, `goods_receipt_header`, `goods_receipt_item`, `invoice_header`, `invoice_item`, `discrepancy_logs`.

---

## 5. Rencana Tahap Selanjutnya: AI Agent Analytics (NL2SQL Engine)

### Arsitektur Pipeline yang Ditetapkan:

```
[ User Query (Natural Language) ]
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 1. Guardrail & Intent Validation                       │
│    - Verifikasi apakah pertanyaan analitik valid       │
│    - Block mutasi data (Hanya izinkan SELECT / READ)   │
└──────────────────────────────┬─────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────┐
│ 2. Semantic Schema Registry                            │
│    - Dynamic Schema Context (Hanya inject tabel relevan│
│    - Injeksi Business Glossary & Definisi Metrik (OEE, │
│      OTD, ROP, MAPE, Big Losses)                       │
└──────────────────────────────┬─────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────┐
│ 3. Text-to-SQL Generation & AST Validator (SQLGlot)    │
│    - LLM generate DuckDB/MotherDuck compatible SQL     │
│    - SQLGlot memvalidasi AST, whitelist tabel/kolom    │
└──────────────────────────────┬─────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────┐
│ 4. Sandboxed Query Execution                           │
│    - Eksekusi read-only ke MotherDuck dengan Timeout & │
│      Row Limit Guardrail                               │
│    - Tangkap result set (Polars/Pandas/JSON)           │
└──────────────────────────────┬─────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────┐
│ 5. Data-Grounded Natural Language Synthesis & UI Card  │
│    - Synthesize jawaban murni berbasis data (Zero Hal.)│
│    - Return query SQL, tabel sumber, confidence level, │
│      dan payload chart/tabel untuk rendering di UI     │
└────────────────────────────────────────────────────────┘
```

### File & Rute yang Akan Dikerjakan:
* **Backend**:
  * `backend/app/services/chat_service.py` (Orkestrasi AI Agent & LangGraph/LangChain)
  * `backend/app/services/sql_engine.py` (Text-to-SQL & SQLGlot Validator)
  * `backend/app/services/schema_registry.py` (Semantic schema & business definitions)
  * `backend/app/api/v1/chat.py` (Streaming chat endpoint & session management)
* **Frontend**:
  * `frontend/app/(dashboard)/chat/page.tsx` (Full Page AI Copilot)
  * `frontend/components/chat/*` (Streaming message card, SQL transparency accordion, data table preview, chart widget renderer)

---

## 6. Catatan Khusus untuk Agent Selanjutnya
1. **Design System & Styling**: Gunakan tema dark palette premium (`#000711` background, `#0555E0` brand blue, `#000000` card surface, `white/10` borders, font Poppins, tanpa sudut melengkung berlebih / border tipis).
2. **Database Integrity**: Selalu gunakan mode `read_only=True` saat melakukan koneksi ke MotherDuck.
3. **AI Guardrails**: AI Agent tidak boleh mengeksekusi mutasi DDL/DML (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`). Semua query wajib divalidasi dengan SQLGlot sebelum dieksekusi.
