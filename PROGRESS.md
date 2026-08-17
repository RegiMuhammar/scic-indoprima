# Supply Chain Intelligence Center (SCIC) — PT Indoprima
# Project Progress & Context Reference Document

> **Dokumen Status & Konteks Antar-Sesi Coding Agent**  
> **Terakhir Diperbarui:** 18 Agustus 2026  
> **Klien:** PT Indoprima Group & PT Indospring Tbk  
> **Status Keseluruhan:** Quick Win 1 (Manufacturing OEE), Quick Win 2 (Demand & Spare Part), dan Quick Win 3 (AI Agent Analytics / NL2SQL Copilot) **100% SELESAI & LIVE**. Siap menuju implementasi **Invoice Matching Intelligence (3-Way Matching)**.

---

## 1. Ringkasan Eksekutif & Milestone Tracker

| Milestone / Modul | Deskripsi | Status | Rute UI | Backend API |
|---|---|:---:|---|---|
| **Data Foundation (MotherDuck)** | 34 Tabel OLAP Cloud (`manufacturing`, `supply_chain`, `finance`) | **✅ SELESAI** | - | MotherDuck Cloud |
| **Executive Control Tower** | Composite Health Score, 4 KPI Scorecards, Trend Chart, Risk Radar, Delivery Orders | **✅ SELESAI** | `/dashboard` | `/api/v1/dashboard/summary` |
| **Quick Win 1: Manufacturing Productivity** | OEE 3-Pillar (Avail, Perf, Qual), 6 Big Losses Pareto 80:20, Shift 1-3 Performance & Labor Fatigue | **✅ SELESAI** | `/dashboard` (Tab Plant OEE) | `/api/v1/dashboard/summary` |
| **Quick Win 2: Spare Part Readiness** | Smart Reorder Point (MRO), BOM Machine Compatibility Engine, Siklus Penggantian Part | **✅ SELESAI** | `/demand-intelligence` (Tab Suku Cadang) | `/api/v1/demand/summary` |
| **Quick Win 2: Demand & Balancing** | Time-Series Demand Forecasting (90% Uncertainty Band), Multi-Warehouse Stock Balancing (Surabaya vs Karawang) | **✅ SELESAI** | `/demand-intelligence` (Tab Forecasting) | `/api/v1/demand/summary` |
| **AI Agent Analytics (NL2SQL Copilot)** | Multi-Tier LangGraph Agent, Validasi AST SQLGlot + MotherDuck `try_bind()`, Senior Expert Critic, Cloudflare-style UI & SSE Streaming | **✅ SELESAI** | `/chat` | `/api/v1/chat` |
| **Invoice Matching Intelligence** | 3-Way Matching (PO ↔ GR ↔ Invoice), Deteksi Selisih AI & Variance Audit | **🟡 NEXT (READY)** | `/invoice-matching` | `/api/v1/invoice` |
| **Data Connections & Health** | Health check sinkronisasi data MotherDuck, ERP, WMS, IoT | **⚪ PLANNED** | `/data-connections` | `/api/v1/data-connections` |
| **AI Explainability & Audit Log** | Trace tool-calling, confidence score transparency, model logs | **⚪ PLANNED** | `/agent-logs` & `/explainability` | `/api/v1/agent-logs` |

---

## 2. Arsitektur Sistem & Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 16 App Router)                 │
│   Tailwind CSS • Shadcn/UI • Recharts • Lucide Icons • React Markdown  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST / SSE Streaming (Port 8000)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI + Python)                       │
│   Pydantic v2 • LangGraph StateGraph • SQLGlot AST • Groq LLM          │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │ OLAP Read-Only (DuckDB)         │ Relational / State
                    ▼                                 ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────┐
│    MOTHERDUCK CLOUD DATA WAREHOUSE   │   │     SUPABASE POSTGRESQL      │
│  34 Live Tables: manufacturing,      │   │  chat_sessions, chat_messages│
│  supply_chain, finance               │   │  agent_logs, audit_log       │
└──────────────────────────────────────┘   └──────────────────────────────┘
```

### Environment & Cara Menjalankan
* **Frontend**:
  * Direktori: `/frontend`
  * Perintah: `npm run dev` (Berjalan di `http://localhost:3000`)
* **Backend**:
  * Direktori: `/backend`
  * Perintah: `uv run uvicorn app.main:app --port 8000 --host 0.0.0.0 --reload` (Berjalan di `http://localhost:8000`)
* **Database**:
  * MotherDuck Cloud (OLAP Analytical Engine)
  * Supabase PostgreSQL (OLTP & Session Persistence)

---

## 3. Detail Modul yang Sudah Rampung (Production-Ready)

### A. AI Agent Analytics & NL2SQL Copilot (`/chat`)
1. **LangGraph Stateful Multi-Tier Architecture**:
   - **Tier 1 (Master Router & Planner)**: Mengklasifikasi intent (`ANALYTICS_QUERY`, `SOP_KNOWLEDGE`, `CROSS_DOMAIN_EXECUTIVE`, `CHIT_CHAT`) dan scoping domain bisnis (`manufacturing`, `supply_chain`, `inventory_mro`, `finance`).
   - **Tier 2 (Domain Specialist Resolver)**: Dynamic schema pruning yang memuat DDL tabel spesifik domain dan business metric glossary (OEE, 6 Big Losses, Smart ROP, OTD Rate).
   - **Tier 3 (SQL Generator & Dual Validator)**:
     - SQLGlot AST parsing menjamin operasi `SELECT / WITH` read-only dan memblokir DDL/DML mutation.
     - MotherDuck native `CALL try_bind(?)` mengecek kesesuaian katalog dan nama kolom sebelum query dieksekusi.
     - Self-Correction Reflection Loop otomatis memperbaiki query bila ada binder error (maks. 3 kali).
   - **Tier 3 (Sandboxed MotherDuck Execution)**: Eksekusi analitik cepat dengan limit timeout dan row count.
   - **Tier 4 (Senior VP Operations & Supply Chain Critic Node)**: Quality gate yang memvalidasi data grounding 100%, memeriksa kedalaman akar penyebab, dan memberikan rekomendasi taktis bagi plant manager. Jika skor < 80, siklus perbaikan (refinement) aktif otomatis.
2. **Backend Services & Persistence**:
   - Supabase sync untuk `chat_sessions`, `chat_messages`, `agent_logs`, dan `audit_log`.
   - Real-time Server-Sent Events (SSE) streaming (`step`, `sql`, `token`, `complete`).
   - Pydantic v2 schemas yang menjamin type safety di seluruh API dan LLM structured output.
3. **Frontend UI/UX Cloudflare-Style Assistant**:
   - **Session Sidebar**: Pengelompokan sesi (*Hari Ini*, *Kemarin*, *7 Hari Terakhir*), pencarian percakapan, New Chat, dan Delete.
   - **Empty State Hero**: Glowing SCIC Intelligence Orb, headline, dan 8 Golden Benchmark Demo Presets.
   - **Action Step Progress**: Visualisasi proses berpikir AI (*-> Ran Query DuckDB...*).
   - **Rich Markdown Content**: Format jawaban natural language profesional, tabel data GFM dengan scroll horizontal, dan code blocks dengan tombol salin.
   - **SQL Transparency Accordion**: Transparansi query DuckDB, durasi eksekusi dalam ms, row count, dan copy SQL button.
   - **Chart Widget Renderer**: Visualisasi otomatis grafik bar/line/donut dari hasil query dengan Recharts.
   - **Floating Input Bar**: Indikator *Read only*, popup contoh pertanyaan, dan send arrow button.

---

## 4. Rencana Tahap Selanjutnya: Invoice Matching Intelligence (3-Way Matching)

### Fitur yang Akan Dibangun:
1. **3-Way Matching Engine**:
   - Rekonsiliasi Purchase Order (`supply_chain.purchase_order`), Goods Receipt Resi (`supply_chain.shipment_resi`), dan Faktur Tagihan (`supply_chain.invoice`).
2. **AI Discrepancy Detector**:
   - Deteksi selisih harga unit (*Price Variance*), kuantitas (*Quantity Variance*), dan tanggal penerimaan.
3. **Discrepancy Resolution & Audit Log**:
   - Approval workflow untuk staf keuangan PT Indoprima.
