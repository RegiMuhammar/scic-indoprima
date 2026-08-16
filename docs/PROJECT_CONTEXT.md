# Supply Chain Intelligence Center (SCIC) — PT Indoprima
## Project Context for AI-Assisted Development

---

## 1. Product Overview

**Supply Chain Intelligence Center (SCIC)** adalah platform *AI decision intelligence* berbasis web yang dirancang khusus untuk **PT Indoprima**, sebuah perusahaan manufaktur otomotif.

### Core Mission
Mengubah data operasional lintas sistem (ERP, WMS, Procurement Portal) menjadi *insight* yang dapat ditindaklanjuti secara real-time, menggunakan kecerdasan buatan sebagai copilot pengambilan keputusan — bukan pengambil keputusan itu sendiri.

### Design Principle: Human-in-the-Loop
> **AI TIDAK PERNAH mengeksekusi keputusan bisnis secara otomatis.**
> Semua rekomendasi, prediksi, dan insight harus melalui review dan persetujuan manusia sebelum ditindaklanjuti.

---

## 2. Quick Win Use Cases (PT Indospring Tbk / Indoprima Group)

Berdasarkan dokumen *Pre-Assessment & Quick Win Scoping*, SCIC difokuskan pada **2 Use Case Quick Win Utama** yang disokong oleh **1 Fondasi Data Bersama**:

```
+-------------------------------------------------------------------------+
|                         SCIC QUICK WIN PLATFORM                         |
+------------------------------------+------------------------------------+
|  Use Case 1:                       |  Use Case 2:                       |
|  MANUFACTURING PRODUCTIVITY (OEE)  |  SPARE PART READINESS              |
|  - Real-time OEE (Avail, Perf, Qual)| - Spare Part Demand Forecasting   |
|  - Unplanned Downtime Analysis     |  - Dynamic Safety Stock & Reorder  |
|  - Shift & Labor Efficiency        |  - BOM Compatibility & Lead Time   |
+------------------------------------+------------------------------------+
|                      FONDASI DATA BERSAMA                               |
|       IoT Condition Monitoring & Telemetry (Vibration, Temp, RPM)       |
+-------------------------------------------------------------------------+
```

### 2.1 Use Case 1: Manufacturing Productivity berbasis OEE
* **Tujuan & KPI:** Meningkatkan OEE real-time, menurunkan *unplanned downtime*, dan meningkatkan utilisasi tenaga kerja (*labor utilization*).
* **Komponen & Metrik:**
  1. **Availability**: Target Schedule vs Downtime Logs (*breakdown, changeover, planned maintenance*) vs status mesin (*running, idle, stop*).
  2. **Performance**: Ideal vs Actual Cycle Time per SKU, analisis *speed loss* dan *minor stops*.
  3. **Quality**: Output total vs *Good Count* vs *Defect Count* / *Rework*.
  4. **Pabrik & Lini**: Pabrik Gresik (`FB-GRS`) & Nganjuk (`FB-NGJ`) dengan lini Leaf Spring, Coil Spring, dan Stabilizer Bar.

### 2.2 Use Case 2: Spare Part Readiness & Predictive Maintenance
* **Tujuan & KPI:** Menjamin ketersediaan suku cadang kritis, mencegah breakdown mesin akibat part kosong, menghemat *inventory carrying cost*, dan mempercepat MTTR (*Mean Time To Repair*).
* **Komponen & Metrik:**
  1. **Demand Forecasting Spare Part**: Prediksi kebutuhan part berbasis histori konsumsi dan pola operasional mesin.
  2. **Dynamic Safety Stock & Smart Reorder Point**: Kalkulasi min/max level berdasarkan volatilitas konsumsi dan variasi *lead time* supplier.
  3. **BOM & Compatibility Engine**: Pemetaan kecocokan sparepart terhadap aset mesin.
  4. **Predictive Pre-positioning**: Integrasi sinyal anomali telemetri sensor IoT untuk memicu rekomendasi pengadaan/penyiapan part sebelum mesin rusak total.

### 2.3 Fondasi Data Bersama (IoT Telemetry & Condition Monitoring)
* Pemantauan sinyal sensor mesin real-time (*vibration, temperature, current, pressure, RPM*) untuk deteksi dini anomali dan integrasi otomatis dengan sistem work order & sparepart.

---

## 3. Target Users

| Role | Tanggung Jawab |
|---|---|
| Plant & Production Manager | Monitoring OEE lini produksi, analisis downtime, efisiensi shift |
| Maintenance & Reliability Engineer | Monitoring kondisi mesin (IoT), mitigasi breakdown, kebutuhan suku cadang |
| Supply Chain & Warehouse Manager | Pengawasan stok sparepart & finished goods, approval replenishment |
| Procurement Analyst | Evaluasi vendor/supplier lead time, eksekusi purchase order part |
| Operations Director | Oversight KPI menyeluruh (OEE, OTIF, Inventory Turnover, Cost) |

---

## 4. Page Inventory & Route Strategy

SCIC menerapkan strategi **Dual-Level Visibility**: *Executive Overview* di Control Tower (`/dashboard`) dan *Deep-Dive Operational Workflow* di halaman khusus masing-masing.

### 4.1 Landing Page & Login Page
**Route:** `/` dan `/login`
**Purpose:** Entry point produk dan autentikasi pengguna via Supabase Auth.

### 4.2 Supply Chain & Manufacturing Control Tower (Dashboard)
**Route:** `/dashboard`
**Purpose:** Pusat komando eksekutif & ringkasan operasional real-time.
**Features:**
- **Plant & Supply Chain Health Score**: Composite OEE dan Health Index pabrik.
- **Executive KPI Cards**: Real-time OEE %, Availability %, MTTR, OTIF Rate, Critical Stockout Alerts.
- **Top Downtime & Anomaly Radar**: Ringkasan downtime mesin terparah dan early warning IoT telemetry.
- **AI Priority Recommendations**: Rekomendasi prioritas (maintenance darurat, replenishment part kritis) dengan confidence score.
- **Fast Navigation / Tab Switcher**: Akses cepat drilldown ke detail OEE Pabrik atau Detail Demand/Part.

### 4.3 Manufacturing Productivity (OEE Deep-Dive)
**Route:** `/dashboard` (Tab Dedicated) atau `/manufacturing-oee`
**Purpose:** Analisis mendalam efektivitas mesin, shift, dan kualitas produksi.
**Features:**
- OEE 3-Pillar Breakdown (Availability, Performance, Quality) per pabrik & lini.
- Shift Performance & Manpower Utilization (Shift 1, 2, dan analisa kelelahan Shift 3).
- Downtime Category Pareto (Breakdown, Changeover, Tooling, Speed Loss).
- Machine Condition & IoT Sensor Telemetry Explorer (Vibration, Temperature trend).

### 4.4 Demand & Spare Part Decision Intelligence
**Route:** `/demand-intelligence`
**Purpose:** Peramalan permintaan dan manajemen inventaris cerdas untuk Spare Part kritis dan Finished Goods.
**Features:**
- **Spare Part Demand Forecasting**: Model time-series peramalan kebutuhan part (StatsForecast/Prophet).
- **Dynamic Reorder Point & Safety Stock**: Rekomendasi kuantitas & waktu reorder berbasis lead time supplier.
- **Stockout & Overstock Risk Matrix**: Visualisasi probabilistik risiko kekosongan part kritis.
- **BOM Machine Compatibility Viewer**: Penelusuran kompatibilitas part terhadap mesin & work order aktif.
- **Human-in-the-Loop Reorder Approval**: Rekomendasi PO siap review & approve oleh Manager.

### 4.5 Invoice Matching Intelligence
**Route:** `/invoice-matching`
**Purpose:** Rekonsiliasi transaksi keuangan tiga arah (PO ↔ GR ↔ Invoice) secara otomatis dan deteksi selisih via AI.

### 4.6 AI Assistant Copilot (RAG + Text-to-SQL)
**Route:** `/chat` (Full page) + Floating Drawer di semua halaman
**Purpose:** Asisten tanya-jawab natural language untuk query data OEE, status mesin, dan inventaris sparepart di MotherDuck via SQLGlot & LangGraph.

### 4.7 AI Agent Logging & Explainability
**Route:** `/agent-logs` & `/explainability`
**Purpose:** Audit trail eksekusi AI, trace tool-calling, serta transparansi confidence score dan faktor pembobot rekomendasi.

### 4.8 Monitoring Connection & Data Health
**Route:** `/data-connections`
**Purpose:** Monitoring kesehatan sinkronisasi data MotherDuck, IoT Telemetry, ERP, dan WMS.

---

## 4. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js (React) | 15.x (App Router) | Web application framework & routing |
| Shadcn UI | latest | Modern, accessible enterprise UI component library |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| TanStack Query | 5.x | Server state management, caching, API sync |
| TanStack Router | 1.x | Type-safe client-side routing |
| React Hook Form | 7.x | Form state management and validation |
| Zod | 3.x | Frontend validation & API schema validation |
| Recharts | 2.x | Interactive charts and dashboard visualization |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.115.x | REST API and AI service orchestration |
| Pydantic v2 | 2.x | Request/response validation and data models |
| SQLAlchemy | 2.x | ORM for application database access |
| LangGraph | 0.2.x | AI agent workflow orchestration |
| LangChain | 0.3.x | LLM, RAG, and tool integration |
| SQLGlot | latest | Safe Text-to-SQL validation and parsing |
| ARQ | latest | Async background job processing |

### Data Platform
| Technology | Purpose |
|---|---|
| MotherDuck (DuckDB Cloud) | OLAP analytics database for supply chain data |
| Supabase PostgreSQL | Platform metadata, user data, chat history, config |
| Upstash Redis | Background job queue and response caching |
| Pinecone | Cloud vector database for RAG (semantic search) |

### AI & Machine Learning
| Technology | Purpose |
|---|---|
| Groq API (Llama 3.3 70B) | LLM inference for AI assistant and reasoning |
| BAAI BGE / Nomic Embedding | Text embedding for semantic search |
| StatsForecast / Prophet | Demand forecasting and time-series prediction |
| Pandas | Data manipulation and preprocessing |
| Scikit-learn | Traditional ML utilities and evaluation |

### Auth & Deployment
| Technology | Purpose |
|---|---|
| Supabase Auth | User authentication and JWT-based authorization |
| Vercel | Frontend hosting |
| Railway | FastAPI backend deployment |

### Export & Reporting
| Technology | Purpose |
|---|---|
| ReportLab | PDF report generation |
| OpenPyXL | Excel report generation |

---

## 5. Architecture Overview

```
+------------------------------------------------------------------+
|                        FRONTEND (Vercel)                         |
|  Next.js 15 . Shadcn UI . TanStack Query . Recharts . Zod       |
+-----------------------------+------------------------------------+
                              | REST API + SSE (Streaming)
                              v
+------------------------------------------------------------------+
|                       BACKEND (Railway)                          |
|  FastAPI . Pydantic v2 . SQLAlchemy 2.0 . ARQ                   |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                    AI Agent Layer                          |  |
|  |  LangGraph Orchestrator --> LangChain Tools               |  |
|  |  +-- RAG Tool (ChromaDB + BGE Embeddings)                 |  |
|  |  +-- Text-to-SQL Tool (MotherDuck + SQLGlot)              |  |
|  |  +-- Forecasting Tool (StatsForecast/Prophet)             |  |
|  |  +-- KPI Calculator Tool                                  |  |
|  +------------------------------------------------------------+  |
+------+----------------------------+-----------------------------+
       |                            |
       v                            v
+---------------+       +------------------------------------------+
|  Upstash      |       |            Data Platform                 |
|  Redis        |       |  MotherDuck   -- OLAP Analytics          |
|  (Queue +     |       |  Supabase PG  -- Metadata + Chat History |
|   Cache)      |       |  ChromaDB     -- Vector Store (RAG)      |
+---------------+       +------------------------------------------+
```

---

## 6. Data Flow: AI Assistant (RAG + Text-to-SQL)

```
User Query
    |
    v
[Intent Classification] --- LangGraph Router
    |
    +--- Semantic Search Intent --> ChromaDB Retrieval --> Context Augmentation
    |
    +--- SQL Query Intent -------> Text-to-SQL (SQLGlot Validation) --> MotherDuck Query
    |
    +--- Hybrid Intent ----------> Both paths in parallel
                                        |
                                        v
                              [LLM Synthesis -- Groq Llama 3.3 70B]
                                        |
                                        v
                              [Response + Explainability Metadata]
                                        |
                                        v
                              Streamed to Frontend (SSE)
```

---

## 7. Key Design Decisions

### 7.1 Human-in-the-Loop Enforcement
Semua output AI diberi label **"AI Recommendation"** yang eksplisit. Tidak ada action yang dapat dieksekusi tanpa konfirmasi pengguna. Setiap rekomendasi dilengkapi tombol **"Review & Approve"** atau **"Reject"**.

### 7.2 Explainability-First
Setiap insight AI wajib menyertakan: confidence score, contributing factors, dan referenced data sources. Panel explainability dapat di-expand di setiap komponen yang menampilkan output AI.

### 7.3 Multi-Tenancy & RBAC
Supabase Auth mengelola autentikasi. Setiap resource dilindungi oleh Row Level Security (RLS) di Supabase. Role: `admin`, `manager`, `analyst`, `viewer`.

### 7.4 Streaming-First AI Responses
AI assistant menggunakan Server-Sent Events (SSE) untuk streaming respons token-by-token, memberikan pengalaman pengguna yang responsif bahkan untuk query yang kompleks.

### 7.5 Safe SQL Generation
Semua query SQL yang dihasilkan AI divalidasi oleh SQLGlot sebelum dieksekusi. Query dibatasi hanya untuk operasi `SELECT`. Tidak ada DDL/DML yang diizinkan dari AI.

---

## 8. Folder Structure

```
scic-indoprima/
|
+-- frontend/                         # Next.js 15 + React
|   +-- app/                          # App Router pages & layouts
|   |   +-- (auth)/                   # Auth route group
|   |   |   +-- login/
|   |   |   +-- layout.tsx
|   |   +-- (dashboard)/              # Protected route group
|   |   |   +-- dashboard/
|   |   |   +-- invoice-matching/
|   |   |   +-- demand-intelligence/
|   |   |   +-- chat/
|   |   |   +-- agent-logs/
|   |   |   +-- explainability/
|   |   |   +-- data-connections/
|   |   |   +-- layout.tsx
|   |   +-- page.tsx                  # Landing page
|   |   +-- layout.tsx                # Root layout
|   |   +-- globals.css
|   +-- components/
|   |   +-- ui/                       # Shadcn base components
|   |   +-- layout/                   # Navbar, Sidebar, Shell
|   |   +-- dashboard/                # Dashboard-specific components
|   |   +-- invoice/                  # Invoice matching components
|   |   +-- demand/                   # Demand intelligence components
|   |   +-- chat/                     # AI chat components
|   |   +-- explainability/           # Explainability panel components
|   |   +-- data-connections/         # Connection monitoring components
|   |   +-- shared/                   # Shared/reusable components
|   +-- hooks/                        # Custom React hooks
|   +-- services/                     # API client functions
|   +-- lib/                          # Utilities, config, constants
|   +-- types/                        # TypeScript type definitions
|   +-- utils/                        # Helper functions
|   +-- public/                       # Static assets
|
+-- backend/                          # FastAPI + AI services
|   +-- app/
|   |   +-- api/                      # Route handlers (versioned)
|   |   |   +-- v1/
|   |   |       +-- dashboard.py
|   |   |       +-- invoice.py
|   |   |       +-- demand.py
|   |   |       +-- chat.py
|   |   |       +-- agent_logs.py
|   |   |       +-- data_connections.py
|   |   |       +-- router.py
|   |   +-- ai/                       # LangGraph agent definitions
|   |   |   +-- agents/
|   |   |   |   +-- chat_agent.py     # Main conversational agent
|   |   |   |   +-- analysis_agent.py # Background analysis agent
|   |   |   +-- tools/                # LangChain tools
|   |   |   |   +-- sql_tool.py       # Text-to-SQL tool
|   |   |   |   +-- rag_tool.py       # RAG retrieval tool
|   |   |   |   +-- forecast_tool.py  # Forecasting tool
|   |   |   |   +-- kpi_tool.py       # KPI calculation tool
|   |   |   +-- graphs/               # LangGraph workflow definitions
|   |   +-- rag/                      # RAG pipeline
|   |   |   +-- embeddings.py         # Embedding model setup
|   |   |   +-- retriever.py          # ChromaDB retriever
|   |   |   +-- indexer.py            # Document indexing pipeline
|   |   +-- forecasting/              # Demand forecasting modules
|   |   |   +-- statsforecast_model.py
|   |   |   +-- prophet_model.py
|   |   |   +-- ensemble.py
|   |   +-- auth/                     # Authentication & authorization
|   |   |   +-- dependencies.py       # FastAPI auth dependencies
|   |   |   +-- supabase_client.py
|   |   +-- repositories/             # Data access layer
|   |   |   +-- chat_repository.py
|   |   |   +-- invoice_repository.py
|   |   |   +-- dashboard_repository.py
|   |   +-- services/                 # Business logic layer
|   |   |   +-- invoice_service.py
|   |   |   +-- demand_service.py
|   |   |   +-- dashboard_service.py
|   |   |   +-- chat_service.py
|   |   +-- db/                       # Database connections
|   |   |   +-- supabase.py           # Supabase PostgreSQL connection
|   |   |   +-- motherduck.py         # MotherDuck/DuckDB connection
|   |   |   +-- redis_client.py       # Upstash Redis connection
|   |   +-- models/                   # SQLAlchemy ORM models
|   |   +-- schemas/                  # Pydantic request/response schemas
|   |   +-- core/                     # App config, settings, middleware
|   |   |   +-- config.py             # Pydantic Settings
|   |   |   +-- middleware.py
|   |   |   +-- logging.py
|   |   +-- utils/                    # Shared utility functions
|   |   +-- main.py                   # FastAPI app entry point
|   +-- tests/                        # Pytest test suite
|       +-- unit/
|       +-- integration/
|       +-- conftest.py
|
+-- datasets/
|   +-- quickwin_manufacturing/       # 18 CSV tables (MotherDuck warehouse sync)
|   |   +-- dim_factories.csv
|   |   +-- dim_production_lines.csv
|   |   +-- dim_machines.csv
|   |   +-- dim_skus.csv
|   |   +-- dim_spare_parts.csv
|   |   +-- dim_bom_compatibility.csv
|   |   +-- fact_production_schedules.csv
|   |   +-- fact_downtime_logs.csv
|   |   +-- fact_production_outputs.csv
|   |   +-- fact_quality_inspections.csv
|   |   +-- fact_shift_manpower.csv
|   |   +-- fact_part_consumptions.csv
|   |   +-- fact_inventory_snapshots.csv
|   |   +-- fact_purchase_orders.csv
|   |   +-- fact_work_orders.csv
|   |   +-- fact_work_order_parts.csv
|   |   +-- fact_machine_telemetry.csv
|   |   +-- fact_anomaly_events.csv
|
+-- prompts/                          # AI system prompts & templates
|   +-- system/
|   |   +-- chat_agent_system.md
|   |   +-- analysis_agent_system.md
|   +-- templates/
|       +-- sql_generation.md
|       +-- insight_generation.md
|
+-- docs/                             # Project documentation
|   +-- PROJECT_CONTEXT.md            # <- This file
|   +-- PRD.md                        # Product Requirements Document
|   +-- ARCHITECTURE.md               # Technical architecture deep-dive
|   +-- ERD.md                        # Entity Relationship Diagram
|   +-- API_REFERENCE.md              # API endpoint documentation
|   +-- DEPLOYMENT.md                 # Deployment guide
|
+-- scripts/                          # Utility scripts
|   +-- generate_quickwin_data.py     # Generator 18 dataset CSV manufaktur realistis
|   +-- upload_to_motherduck.py       # Uploader dataset ke MotherDuck Cloud
|   +-- create_views.py               # Pembuat SQL analytical views (OEE & Spare Part)
|   +-- sql/
|       +-- 01_manufacturing_schema.sql
|       +-- 02_create_oee_views.sql
|
+-- README.md                         # Project overview & quick start
+-- .gitignore
```

---

## 9. API Route Convention

```
Base URL: /api/v1

Authentication:
  POST   /api/v1/auth/login
  POST   /api/v1/auth/logout
  GET    /api/v1/auth/me

Dashboard & Control Tower:
  GET    /api/v1/dashboard/health-score
  GET    /api/v1/dashboard/kpis
  GET    /api/v1/dashboard/insights
  GET    /api/v1/dashboard/alerts
  GET    /api/v1/dashboard/oee-summary

Manufacturing Productivity (OEE):
  GET    /api/v1/oee/overview
  GET    /api/v1/oee/lines/{id}
  GET    /api/v1/oee/downtime-pareto
  GET    /api/v1/oee/telemetry/{machine_id}

Spare Part & Demand Intelligence:
  GET    /api/v1/demand/forecast
  GET    /api/v1/demand/spareparts/reorder-recommendations
  GET    /api/v1/demand/spareparts/critical-stock
  GET    /api/v1/demand/spareparts/{part_id}/bom
  POST   /api/v1/demand/scenario

Invoice Matching:
  GET    /api/v1/invoices
  POST   /api/v1/invoices/upload
  GET    /api/v1/invoices/{id}
  POST   /api/v1/invoices/{id}/match
  PATCH  /api/v1/invoices/{id}/status
  GET    /api/v1/invoices/{id}/explainability

AI Chat:
  GET    /api/v1/chat/sessions
  POST   /api/v1/chat/sessions
  DELETE /api/v1/chat/sessions/{id}
  GET    /api/v1/chat/sessions/{id}/messages
  POST   /api/v1/chat/sessions/{id}/messages   # Returns SSE stream

Agent Logs:
  GET    /api/v1/agent-logs
  GET    /api/v1/agent-logs/{id}

Data Connections:
  GET    /api/v1/connections/status
  POST   /api/v1/connections/{source}/sync
  GET    /api/v1/connections/{source}/logs
```

---

## 10. Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

### Backend (.env)
```env
# App
APP_ENV=development
SECRET_KEY=<secret>

# Supabase
SUPABASE_URL=<supabase-project-url>
SUPABASE_SERVICE_KEY=<supabase-service-role-key>
DATABASE_URL=<supabase-postgres-connection-string>

# MotherDuck
MOTHERDUCK_TOKEN=<motherduck-token>
MOTHERDUCK_DB=scic_analytics

# Upstash Redis
UPSTASH_REDIS_URL=<redis-url>
UPSTASH_REDIS_TOKEN=<redis-token>

# ChromaDB
CHROMA_HOST=localhost
CHROMA_PORT=8001

# Groq
GROQ_API_KEY=<groq-api-key>

# ARQ
ARQ_REDIS_URL=<redis-url>
```

---

## 11. Development Status

| Module | Status | Notes |
|---|---|---|
| Project Setup & Shell | ✅ Completed | Next.js 15, FastAPI, Tailwind CSS, Dark Theme layout |
| Quick Win Datasets (18 CSVs) | ✅ Completed | 18 tabel di `datasets/quickwin_manufacturing/` |
| OLAP Database & Views | ✅ Completed | MotherDuck schema & analytical OEE views |
| Dashboard (Control Tower) | 🔄 In Progress | Metric cards, Risk radar, AI insight panels |
| Demand & Spare Part Intelligence | 🔄 In Progress | Forecasting, safety stock & reorder recommendations |
| AI Chat Copilot (RAG + Text-to-SQL) | 🔄 In Progress | LangGraph + Groq + SQLGlot integration |
| Invoice Matching | 🔄 Planned | 3-way matching & discrepancy engine |
| Agent Logging & Explainability | 🔄 In Progress | Audit trail and reasoning trace |
| Data Connections Monitor | 🔄 In Progress | Connection health metrics |

---

*Last Updated: 2026-08-16*
*Author: Development Team -- PT Indoprima SCIC Project*
