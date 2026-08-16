# SCIC Metrics Catalog — Index & Sitemap
> **Direktori Acuan Metrik per Halaman untuk AI-Assisted Development**

Folder ini dirancang khusus sebagai panduan terisolasi per halaman/modul agar agen AI dapat bekerja secara fokus, presisi, dan hemat token context window.

---

## 📑 Daftar Spesifikasi Metrik per Modul

| No | Modul / Halaman | Route | File Spesifikasi | Fokus Utama |
|---|---|---|---|---|
| **01** | **Supply Chain Control Tower** | `/dashboard` | [`01_dashboard_control_tower_metrics.md`](file:///d:/Project%20Coding/scic-indoprima/docs/metrics/01_dashboard_control_tower_metrics.md) | Health Index (0-100), OTD Rate %, Production Achievement %, At-Risk Delivery Orders, Risk Radar |
| **02** | **Manufacturing Productivity** | `/manufacturing-oee` / `/dashboard` Tab | [`02_manufacturing_oee_metrics.md`](file:///d:/Project%20Coding/scic-indoprima/docs/metrics/02_manufacturing_oee_metrics.md) | OEE (Availability, Performance, Quality), 6 Big Losses Pareto, Shift 1/2/3 Fatigue, IoT Sensor Waveform |
| **03** | **Invoice Matching Intelligence** | `/invoice-matching` | [`03_invoice_matching_metrics.md`](file:///d:/Project%20Coding/scic-indoprima/docs/metrics/03_invoice_matching_metrics.md) | 3-Way Match Rate %, Discrepancy Qty/Amount Delta, Harmonization Confidence %, Exception Severity |
| **04** | **Demand & Inventory Intelligence** | `/demand-intelligence` | [`04_demand_inventory_metrics.md`](file:///d:/Project%20Coding/scic-indoprima/docs/metrics/04_demand_inventory_metrics.md) | Demand Forecast MAPE, Uncertainty Band, Days of Supply, Stock Balancing Imbalance Value (Rp 23,3 M), Spare Part Smart ROP |
| **05** | **AI Copilot & Governance** | `/chat`, `/agent-logs`, `/explainability` | [`05_ai_copilot_governance_metrics.md`](file:///d:/Project%20Coding/scic-indoprima/docs/metrics/05_ai_copilot_governance_metrics.md) | P95 Query Latency, Confidence Score %, Contributing Factors Weight, Human Approval Rate % |
| **06** | **Data Connections & IoT Health** | `/data-connections` | [`06_data_connections_metrics.md`](file:///d:/Project%20Coding/scic-indoprima/docs/metrics/06_data_connections_metrics.md) | Data Sync Latency, Record Throughput, Freshness %, Anomaly Rate % |

---

## 🛠️ Format Standar Setiap Spesifikasi Metrik:
1. **Nama Metrik & Tipe Komponen UI** (Scorecard, Bar Chart, Line Chart, Radar, Table)
2. **Formula Bisnis & Data Lineage** (Tabel & Kolom Sumber di MotherDuck / Supabase)
3. **Contoh Query SQL Valid di MotherDuck**
4. **Threshold Status & Mapping Warna** (Hijau `Good`, Kuning `Warning`, Merah `Danger/Critical`)
5. **Kebutuhan AI Grounding & Explainability**
