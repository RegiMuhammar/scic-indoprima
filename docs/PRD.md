# Supply Chain Intelligence Center (SCIC)
## Product Requirements Document (PRD) — Unified AI Decision Intelligence Platform

> **Client / Organization:** PT Indoprima Group & PT Indospring Tbk  
> **Product Name:** Supply Chain Intelligence Center (SCIC)  
> **Status:** Final Baseline for Development (v1.0)  
> **Prepared by:** Development Team  

---

## 1. Product Overview & Abstract

**Supply Chain Intelligence Center (SCIC)** adalah platform *AI decision intelligence* terintegrasi yang dirancang khusus untuk **PT Indoprima Group** dan **PT Indospring Tbk** guna mengubah data operasional manufaktur dan rantai pasok yang terfragmentasi lintas sistem (SAP S/4HANA ERP, Indoprima WMS, E-Procurement Supplier Portal, Shopfloor SCADA/PLC, dan IoT Condition Telemetry) menjadi *insight* dan rekomendasi yang dapat langsung ditindaklanjuti secara proaktif.

### 1.1 Core Mission
Mengintegrasikan seluruh data operasional end-to-end (dari lantai pabrik, manajemen suku cadang MRO, logistik antar-cabang, hingga rekonsiliasi keuangan supplier) dalam satu *Single Pane of Glass*, serta menjawab 4 pertanyaan inti bisnis:
1. **Apa yang sedang terjadi?** *(Descriptive & Real-time Monitoring)*
2. **Mengapa masalah tersebut terjadi?** *(Diagnostic & Root-Cause Anomaly Detection)*
3. **Apa yang akan terjadi jika tren berlanjut?** *(Predictive Forecasting & Early Warning)*
4. **Apa tindakan terbaik yang harus diambil?** *(Prescriptive Recommendations)*

### 1.2 Core Principle: Human-in-the-Loop AI Governance
> **AI TIDAK PERNAH mengeksekusi keputusan bisnis secara otomatis tanpa persetujuan manusia.**  
> Seluruh rekomendasi AI (pembuatan Purchase Order, relokasi stok antar-cabang, penyesuaian jadwal maintenance) selalu menyertakan **Confidence Score (%)**, **Contributing Factors**, serta tombol aksi eksplisit: `Approve`, `Adjust/Override`, atau `Reject`. Setiap keputusan manusia dicatat dalam **Audit Trail** yang *immutable*.

---

## 2. Business Objectives & KPI

| Business Goal | Primary Metric | Target / Benchmark | Impact bagi Indoprima |
|---|---|---|---|
| **Percepatan Deteksi Risiko** | Rata-rata waktu deteksi risiko (*hours to awareness*) | < 15 Menit sejak timbul anomali | Mengubah operasional dari reaktif menjadi proaktif |
| **Produktivitas Manufaktur** | Overall Equipment Effectiveness (OEE) | Target OEE ≥ 85% (World Class) | Menekan *unplanned downtime* mesin stamping & forming |
| **Kesiapan Suku Cadang** | Spare Part Stockout Rate & MTTR | Stockout < 3%, MTTR turun 25% | Mencegah mesin breakdown berhenti akibat part kosong |
| **Efisiensi Modal Kerja** | Nilai Inventory Imbalance Antar-Cabang | Potensi relokasi Rp 23,3 M | Mengurangi dead-stock Karawang & mengatasi krisis Surabaya |
| **Akurasi Rekonsiliasi Keuangan**| Auto-match rate & Discrepancy Detection | Auto-match ≥ 90%, Discrepancy 100% flag | Menghilangkan selisih bayar invoice vs penerimaan gudang |
| **Kepercayaan pada AI** | Human Approval Rate atas Rekomendasi AI | Approval/Adjust Rate ≥ 80% | Validasi adopsi pengguna terhadap kecerdasan sistem |

---

## 3. Target Users & User Personas

| Role / Persona | Fokus Tanggung Jawab | Modul Utama yang Digunakan |
|---|---|---|
| **Operations Director / VP Supply Chain** | Pengawasan kesehatan makro rantai pasok, OEE grup, risk radar | `/dashboard`, `/agent-logs` |
| **Plant & Production Manager** | Monitoring OEE lini produksi, 6 big losses, efisiensi shift | `/dashboard` (Plant OEE), `/chat` |
| **Maintenance & Reliability Engineer** | Monitoring IoT sensor mesin, degradasi bearing, work order part | `/dashboard`, `/demand-intelligence` (Spare Parts) |
| **Demand Planner & Warehouse Head** | Peramalan demand SKU, stock balancing, reorder suku cadang | `/demand-intelligence` |
| **Finance Controller & Procurement Analyst** | Rekonsiliasi invoice 3 arah, evaluasi supplier lead time | `/invoice-matching`, `/data-connections` |

---

## 4. Module & Feature Specifications

SCIC terdiri dari **6 Modul Fungsional Terpadu** yang saling terhubung dalam satu navigasi antarmuka:

```
+-----------------------------------------------------------------------------------+
|                        SUPPLY CHAIN INTELLIGENCE CENTER                           |
+-----------------------------------------------------------------------------------+
| 1. Control Tower Dashboard     | 2. Manufacturing Productivity (OEE)             |
| 3. Invoice Matching Intel.     | 4. Demand, Stock Balancing & Spare Part Intel.  |
| 5. AI Copilot (Text-to-SQL)    | 6. AI Explainability, Logs & Connection Health   |
+-----------------------------------------------------------------------------------+
```

### 4.1 Modul 1: Supply Chain & Manufacturing Control Tower
* **Route:** `/dashboard`
* **Purpose:** Pusat komando eksekutif real-time (*Single Pane of Glass*).
* **Fitur Utama:**
  1. **Supply Chain & Plant Health Index**: Skor komposit (0–100) berbasis bobot On-Time Delivery (35%), Production Achievement (30%), Inventory Risk (20%), dan Forecast Accuracy (15%).
  2. **Executive KPI Scorecards**: OTD Rate %, Production Achievement %, At-Risk Delivery Orders, Forecast Accuracy %, dan OEE Global %.
  3. **AI Priority Decision Insights**: Kartu insight berprioritas (Critical, High, Medium) dengan confidence score, estimasi dampak finansial, dan tombol CTA *"Investigate & Resolve"*.
  4. **Early Warning Risk Radar**: Tabel pendeteksi risiko operasional proaktif (gangguan hidrolik mesin, bottleneck pelabuhan Tanjung Perak, lonjakan demand).
  5. **Operational Trend & Anomaly Chart**: Visualisasi tren performa vs target dengan penanda anomali visual.

### 4.2 Modul 2: Manufacturing Productivity berbasis OEE (Quick Win 1)
* **Route:** `/dashboard` (Tab Dedicated) atau `/manufacturing-oee`
* **Purpose:** Analisis efektivitas peralatan pabrik per lini dan identifikasi akar masalah downtime.
* **Fitur Utama:**
  1. **OEE 3-Pillar Breakdown**: Kalkulasi real-time *Availability* (Schedule vs Downtime), *Performance* (Actual vs Ideal Cycle Time), dan *Quality* (Good vs Reject/Rework) per lini pabrik (Leaf Spring, Coil Spring, Stabilizer Bar).
  2. **Downtime Pareto Analysis**: Visualisasi 6 Big Losses (Unplanned Breakdown, Changeover, Tooling Setup, Minor Stops, Speed Loss).
  3. **Shift Performance & Fatigue Tracker**: Evaluasi output dan efektivitas jam kerja antar shift (Shift 1, Shift 2, dan analisa degradasi Shift 3 malam).
  4. **Machine IoT Waveform Explorer**: Monitoring langsung sinyal sensor telemetri (Getaran/Vibration mm/s, Temperatur °C, Arus Listrik Ampere, dan RPM) pada mesin kritis.

### 4.3 Modul 3: Invoice Matching Intelligence
* **Route:** `/invoice-matching`
* **Purpose:** Rekonsiliasi data transaksi keuangan 3 arah lintas sistem secara otomatis.
* **Fitur Utama:**
  1. **Reconciliation Overview**: Ringkasan Total Transactions, Auto-Matched, Partial Match, Discrepancies, dan Pending Human Review.
  2. **Cross-System 3-Way Triad Viewer**: Visualisasi keterhubungan Purchase Order (E-Procurement) ↔ Invoice (SAP ERP) ↔ Surat Jalan / Resi (Indoprima WMS).
  3. **Master Data Harmonization**: Penyeragaman variasi nama supplier, taksonomi produk, dan unit satuan (UOM) menggunakan Tax ID exact match & semantic fuzzy resolution.
  4. **Field-Level Discrepancy & Exception Tagging**: Deteksi selisih kuantitas (short-shipped), selisih nilai harga, dan tag anomali (mis. *Damaged Goods on Dock*).
  5. **Review Queue & Approval Workflow**: Antrian review transaksi bermasalah dengan tombol `Approve Match`, `Override`, atau `Reject` beserta input catatan.

### 4.4 Modul 4: Demand, Stock Balancing & Spare Part Readiness (Quick Win 2)
* **Route:** `/demand-intelligence`
* **Purpose:** Peramalan permintaan, mitigasi stockout/overstock, relokasi stok antar-cabang, dan kesiapan suku cadang mesin.
* **Fitur Utama:**
  1. **Demand Forecasting Time-Series**: Proyeksi permintaan multi-horizon (30/60/90 hari) dengan rentang ketidakpastian (*uncertainty band*) berbasis model peramalan (StatsForecast/Prophet).
  2. **Forecast Explainability**: Penjelasan faktor pendorong positif (*positive drivers*) dan faktor risiko ketidakpastian (*risk drivers*).
  3. **Inter-Branch Stock Balancing Recommendation**: Rekomendasi transfer inventaris antar-gudang (mis. relokasi dead-stock Karawang senilai Rp 23,3 M ke gudang Surabaya yang krisis).
  4. **Spare Part Criticality & Smart Reorder Point**: Kalkulasi safety stock dinamis suku cadang MRO berdasarkan volatilitas konsumsi dan lead time supplier.
  5. **BOM Machine Compatibility & Predictive Pre-positioning**: Pemetaan kecocokan sparepart terhadap aset mesin untuk memicu pemesanan part sebelum mesin mengalami breakdown fatal.
  6. **Interactive Scenario Simulator**: Slider simulasi *What-If* (Demand Surge % dan Supplier Lead Time Delay) untuk menghitung ulang kebutuhan replenishment secara real-time.

### 4.5 Modul 5: AI Assistant Copilot (RAG + Text-to-SQL)
* **Route:** `/chat` (Full page) + Floating Drawer di seluruh halaman
* **Purpose:** Tanya-jawab analitik bahasa natural untuk seluruh domain data operasional.
* **Fitur Utama:**
  1. **Hybrid Architecture Router**: Membedakan query agregasi data terstruktur (dirutekan ke Text-to-SQL via SQLGlot & MotherDuck) vs query analitik kontekstual/SOP (dirutekan ke Semantic RAG).
  2. **Structured Response Format**: Jawaban wajib memuat *Direct Answer*, *Supporting Metrics*, *Contributing Factors*, *Confidence Score*, dan *Recommended Action*.
  3. **Multi-turn Context & Multi-Session**: Pengelolaan sesi percakapan persisten di Supabase PostgreSQL.
  4. **Streaming Response**: Pengalaman pengetikan interaktif via Server-Sent Events (SSE).

### 4.6 Modul 6: AI Governance, Agent Logs & Explainability
* **Route:** `/agent-logs`, `/explainability`, dan `/data-connections`
* **Purpose:** Transparansi reasoning model, audit trail eksekusi tools, dan status kesehatan integrasi data.
* **Fitur Utama:**
  1. **Agent Execution Trace**: Log setiap query, generated SQL, latency ms, dan tools yang dipanggil oleh agent.
  2. **Human-in-the-Loop Audit Log**: Catatan permanen dan *immutable* dari setiap aksi approval/penyesuaian yang dilakukan pengguna.
  3. **Data Source Connection Health**: Monitoring status simulasi koneksi SAP ERP, Indoprima WMS, E-Procurement, dan Port Customs.

---

## 5. Technical Architecture & Tech Stack Summary

```
+-----------------------------------------------------------------------------+
|                            FRONTEND LAYER                                   |
|   Next.js 15 (App Router) | React 19 | Shadcn UI | Tailwind CSS | Recharts  |
|   TanStack Query v5 | React Hook Form | Zod Schemas                         |
+--------------------------------------+--------------------------------------+
                                       | REST API + SSE Streaming
                                       v
+-----------------------------------------------------------------------------+
|                         BACKEND & ORCHESTRATION LAYER                       |
|   FastAPI | Pydantic v2 | SQLAlchemy 2.0 | LangGraph Orchestrator           |
|   LangChain Tool Calling | SQLGlot Validator | StatsForecast / Prophet      |
+-------------------+-----------------------------------+---------------------+
                    |                                   |
                    v                                   v
+-------------------------------------+   +-----------------------------------+
|         OPERATIONAL DATA STORE      |   |       ANALYTICAL DATA STORE       |
|   Supabase PostgreSQL               |   |   MotherDuck (DuckDB Cloud OLAP)  |
|   - Supabase Auth & JWT             |   |   - 34 Structured Tables          |
|   - Chat Sessions & Messages        |   |   - Analytical OEE & Stock Views  |
|   - Agent Logs & Audit Trail        |   |   - High-Speed Query Engine       |
|   - Connection Configurations       |   |                                   |
+-------------------------------------+   +-----------------------------------+
```

---

## 6. AI Model Evaluation Specifications & Trust Gates

Untuk menjamin keandalan sebelum digunakan dalam lingkungan produksi enterprise, model AI wajib memenuhi ambang batas evaluasi berikut:

| Trust Metric | Target Threshold | Metode Evaluasi | Tipe Gate |
|---|---|---|---|
| **SQL Execution Correctness** | ≥ 95% Match Golden Dataset | Perbandingan eksekusi SQL otomatis | **Hard Gate (Auto Block)** |
| **RAG Hallucination Rate** | < 5% | LLM-as-Judge Grounding Verification | **Hard Gate (Auto Block)** |
| **Query Latency (P95)** | < 5.0 Detik | Performance Profiling Logger | **Soft Gate (PM Sign-off)** |
| **Recommendation Relevance**| ≥ 85% Relevan & Actionable | Reviewer Human Subject Matter Expert | **Soft Gate (PM Sign-off)** |
| **Confidence Governance** | 100% Insight memiliki Skor & Sumber | Validasi Skema Respons Pydantic/Zod | **Hard Gate (Auto Block)** |

---

## 7. Data Requirements & Lineage Mapping

* **Cakupan Data**: 34 Tabel Terstruktur (16 Core Supply Chain + 18 Manufacturing Quick Win).
* **Lokasi Dataset**: Direktori `datasets/` (`inventory/`, `invoices/`, `demand_history/`, `procurement/`, `erp_master/`, `ai_governance/`, `quickwin_manufacturing/`).
* **Format**: File CSV (UTF-8, ISO-8601 Date, Decimal Point).
* **Target Load**: MotherDuck Cloud OLAP DB `scic_analytics`.

---

## 8. Rollout Plan & Milestones

1. **Milestone 1 (Current)**: Interaktif MVP Web Platform dengan 34 dataset terstruktur, analitik OEE, invoice matching, stok balancing, peramalan demand, dan AI copilot.
2. **Milestone 2**: Walkthrough & Sesi Uji Coba bersama Tim Stakeholder PT Indoprima (Supply Chain, Operasional Pabrik, Finance).
3. **Milestone 3**: Business & Technical Deep Assessment untuk integrasi langsung API SAP S/4HANA dan konektor IoT SCADA.
4. **Milestone 4**: Pilot Implementation terbatas di Pabrik Surabaya & Gresik.
5. **Milestone 5**: Full Rollout multi-plant enterprise.
