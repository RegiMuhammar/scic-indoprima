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

## 2. Target Users

| Role | Tanggung Jawab |
|---|---|
| Supply Chain Manager | Pengawasan end-to-end rantai pasok, approval keputusan strategis |
| Procurement Analyst | Rekonsiliasi invoice, manajemen vendor, negosiasi harga |
| Warehouse Supervisor | Monitoring stok, eksekusi replenishment |
| Finance Controller | Validasi transaksi, audit trail, laporan keuangan |
| Operations Director | Oversight KPI, risk management, strategic reporting |

---

## 3. Page Inventory & Feature Specification

### 3.1 Landing Page & Login Page
**Route:** `/` dan `/login`

**Purpose:** Entry point produk — menampilkan value proposition SCIC dan autentikasi pengguna.

**Features:**
- Hero section dengan product pitch dan key differentiators
- Feature highlights (Supply Chain Control Tower, AI Assistant, Demand Intelligence)
- Login form dengan Supabase Auth (email/password + SSO)
- Role-based redirect setelah login
- Secure session management via JWT

---

### 3.2 Dashboard Analytics & Monitoring (Supply Chain Control Tower)
**Route:** `/dashboard`

**Purpose:** Pusat komando rantai pasok — visibilitas menyeluruh terhadap kesehatan operasional secara real-time.

**Features:**
- **Supply Chain Health Score** — composite score berbasis weighted KPI
- **KPI Monitoring Panel** — inventory turnover, OTIF rate, fill rate, lead time, procurement cycle time
- **AI Priority Insights** — top-N actionable recommendations yang dihasilkan AI, disertai confidence score
- **Early Warning Risk Radar** — anomaly detection, threshold breach alerts, risk categorization
- **Live Data Feed** — streaming status dari ERP, WMS, Procurement Portal
- **Entry Point ke AI Assistant Chatbot** — floating button / sidebar launcher yang membuka chat session

---

### 3.3 Invoice Matching Intelligence
**Route:** `/invoice-matching`

**Purpose:** Rekonsiliasi dan harmonisasi transaksi keuangan lintas sistem secara cerdas.

**Features:**
- Upload dan parsing invoice (PDF, Excel)
- Three-way matching: Purchase Order ↔ Goods Receipt ↔ Invoice
- AI-powered discrepancy detection dengan confidence score
- Explainability panel per transaksi (faktor penyebab mismatch)
- Workflow approval: Draft → Review → Approved / Disputed
- Audit trail lengkap per invoice
- Bulk export ke PDF / Excel (ReportLab / OpenPyXL)

---

### 3.4 Demand & Inventory Decision Intelligence
**Route:** `/demand-intelligence`

**Purpose:** Peramalan permintaan dan manajemen stok berbasis AI untuk mencegah stockout dan overstock.

**Features:**
- **Demand Forecasting** — time-series prediction menggunakan StatsForecast/Prophet
- **Stockout & Overstock Projection** — visualisasi probabilistik per SKU
- **Replenishment Recommendation Engine** — saran order quantity, timing, dan supplier, dengan confidence score
- **Safety Stock Calculator** — berbasis variabilitas demand dan lead time
- **Scenario Planning** — what-if analysis (perubahan lead time, demand spike, dsb.)
- **SKU-level Drill-down** — detail histori, proyeksi, dan rekomendasi per item

---

### 3.5 AI Assistant Chatbot (RAG + Text-to-SQL Agent)
**Route:** `/chat` (halaman penuh) + floating panel di `/dashboard`

**Architecture:** RAG + Text-to-SQL Agent via LangGraph/LangChain

**Features:**
- **Multi-session Management** — user dapat membuat, mengganti, dan menghapus sesi percakapan
- **Chat History Persistence** — riwayat percakapan tersimpan per user di Supabase PostgreSQL
- **Hybrid Retrieval** — semantic search (ChromaDB) + SQL generation (Text-to-SQL via SQLGlot)
- **Tool-calling AI Agent** — agent dapat memanggil tools: query_database, retrieve_documents, calculate_forecast, get_kpi
- **Streaming Response** — output AI di-stream token-by-token (SSE / WebSocket)
- **Context Window Management** — manajemen memori percakapan dengan sliding window + summary
- **Suggested Questions** — contoh pertanyaan kontekstual berdasarkan halaman aktif user

---

### 3.6 AI Agent Logging History
**Route:** `/agent-logs`

**Purpose:** Rekam jejak audit seluruh aktivitas AI agent — transparansi dan akuntabilitas penuh.

**Features:**
- Log tiap query yang masuk (user, timestamp, session ID)
- Log tiap tool-call yang dieksekusi agent (tool name, parameters, response time, status)
- Log reasoning chain agent (intermediate steps LangGraph)
- Filter & search: by user, date range, session, tool name, status
- Detail view per log entry: full trace, input/output, error (jika ada)
- Export log ke CSV / JSON

---

### 3.7 AI Explainability Panel
**Route:** `/explainability` + embedded panel di setiap insight card

**Purpose:** Transparansi keputusan dan rekomendasi AI agar pengguna memahami dasar logika di balik setiap output.

**Features:**
- **Confidence Score** — probabilitas kebenaran per output (0–100%)
- **Contributing Factors** — variabel input yang paling berpengaruh terhadap output
- **Data Sources Referenced** — dokumen, tabel, dan rentang data yang digunakan
- **Reasoning Trace** — langkah-langkah reasoning agent yang dapat di-expand
- **Feedback Mechanism** — user dapat memberi rating (thumbs up/down) pada setiap insight

---

### 3.8 Monitoring Connection & Data Health
**Route:** `/data-connections`

**Purpose:** Dashboard status koneksi dan kesehatan sinkronisasi dari setiap sistem sumber data.

**Features:**
- **Connection Status per Source System** — ERP, WMS, Procurement Portal, dan sistem lain
- **Sync Health Metrics** — last sync timestamp, record count, latency, error rate
- **Data Quality Indicators** — completeness, freshness, anomaly rate per dataset
- **Alert Configuration** — threshold untuk notifikasi degradasi koneksi
- **Manual Sync Trigger** — tombol untuk memicu sinkronisasi ulang (dengan konfirmasi)
- **Connection Log** — histori sync events, errors, dan durasi per sistem

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
+-- datasets/                         # Dummy supply chain data (CSV, Parquet)
|   +-- inventory/
|   +-- invoices/
|   +-- demand_history/
|   +-- procurement/
|   +-- erp_master/
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
|   +-- seed_data.py                  # Database seeder
|   +-- index_documents.py            # RAG document indexer
|   +-- generate_dummy_data.py        # Dummy data generator
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

Dashboard:
  GET    /api/v1/dashboard/health-score
  GET    /api/v1/dashboard/kpis
  GET    /api/v1/dashboard/insights
  GET    /api/v1/dashboard/alerts

Invoice Matching:
  GET    /api/v1/invoices
  POST   /api/v1/invoices/upload
  GET    /api/v1/invoices/{id}
  POST   /api/v1/invoices/{id}/match
  PATCH  /api/v1/invoices/{id}/status
  GET    /api/v1/invoices/{id}/explainability

Demand Intelligence:
  GET    /api/v1/demand/forecast
  GET    /api/v1/demand/stockout-risk
  GET    /api/v1/demand/recommendations
  POST   /api/v1/demand/scenario

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
| Project Setup & Structure | In Progress | Folder structure initialized |
| Landing & Login Page | Not Started | |
| Dashboard | Not Started | |
| Invoice Matching | Not Started | |
| Demand Intelligence | Not Started | |
| AI Chat (RAG + Text-to-SQL) | Not Started | |
| Agent Logging | Not Started | |
| Explainability Panel | Not Started | |
| Data Connections Monitor | Not Started | |
| Data Models & ERD | Not Started | To be added |
| Dummy Datasets | Not Started | |

---

*Last Updated: 2026-08-04*
*Author: Development Team -- PT Indoprima SCIC Project*
