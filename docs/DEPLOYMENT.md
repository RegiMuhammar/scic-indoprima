# Deployment & Operations Runbook — SCIC PT Indoprima
> **Platform:** Supply Chain Intelligence Center (SCIC)  
> **Target Environments:** Local Development, Staging, & Production  
> **Status:** Production Ready Guide v1.0  

---

## 1. Deployment Architecture Overview

```
+-------------------------------------------------------------------------+
|                                PRODUCTION                               |
+------------------------------------+------------------------------------+
|  FRONTEND HOSTING                  |  BACKEND SERVICES                  |
|  Platform: Vercel                  |  Platform: Railway / Docker        |
|  Framework: Next.js 15 (Node.js 22)|  Runtime: Python 3.11+ (FastAPI)   |
|  Domain: scic.indoprima.com        |  Domain: api.scic.indoprima.com    |
+------------------------------------+------------------------------------+
|  DATA & PERSISTENCE LAYER                                               |
|  - Analytical OLAP: MotherDuck (DuckDB Cloud)                           |
|  - Operational Database: Supabase PostgreSQL (Auth + Chat + Audit)     |
|  - Cache & Background Queue: Upstash Redis (Serverless)                 |
+-------------------------------------------------------------------------+
```

---

## 2. Environment Variables Specification

### 2.1 Backend (`backend/.env`)
```env
# Application Settings
APP_ENV=production
APP_NAME="SCIC API Service"
PORT=8000
SECRET_KEY="<generate-secure-random-32-char-string>"
CORS_ORIGINS="https://scic.indoprima.com,http://localhost:3000"

# Supabase (Operational Database & Auth)
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_KEY="<supabase-service-role-key>"
DATABASE_URL="postgresql+asyncpg://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres"

# MotherDuck (Analytical OLAP Database)
MOTHERDUCK_TOKEN="<motherduck-cloud-access-token>"
MOTHERDUCK_DB="scic_analytics"

# AI & LLM Inference
GROQ_API_KEY="gsk_<groq-api-key>"
DEFAULT_MODEL="llama-3.3-70b-versatile"
EMBEDDING_MODEL="BAAI/bge-small-en-v1.5"

# Upstash Redis (Cache & ARQ Queue)
UPSTASH_REDIS_URL="rediss://default:<password>@<endpoint>.upstash.io:6379"
UPSTASH_REDIS_TOKEN="<upstash-token>"

# Vector Store (ChromaDB / Pinecone)
CHROMA_HOST="localhost"
CHROMA_PORT=8001
```

### 2.2 Frontend (`frontend/.env.local` / Vercel Environment)
```env
# Backend API Integration
NEXT_PUBLIC_API_URL="https://api.scic.indoprima.com"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-public-key>"
```

---

## 3. Database Initialization & Data Seeding

### 3.1 Step 1: Inisialisasi Tabel & Views di MotherDuck
Jalankan script python seeder untuk memuat seluruh 34 dataset CSV ke database MotherDuck:
```bash
cd backend
python ../scripts/upload_to_motherduck.py
python ../scripts/create_views.py
```

### 3.2 Step 2: Inisialisasi Skema di Supabase PostgreSQL
Jalankan SQL Migration DDL pada SQL Editor Supabase untuk membuat tabel operasional:
- `chat_session`
- `chat_message`
- `agent_execution_log`
- `audit_log`
- `data_source_connection`

---

## 4. Langkah Deployment Frontend & Backend

### 4.1 Backend (Railway)
1. Hubungkan repository GitHub ke proyek Railway.
2. Tambahkan Environment Variables sesuai spesifikasi Bagian 2.1.
3. Railway otomatis mendeteksi `backend/Dockerfile` atau Procfile:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY pyproject.toml requirements.txt ./
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

### 4.2 Frontend (Vercel)
1. Import repository ke dashboard Vercel dengan root directory: `frontend`.
2. Framework Preset: **Next.js**.
3. Masukkan `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Jalankan Deploy.

---

## 5. Verifikasi & Smoke Testing Pasca-Deploy

Jalankan serangkaian uji coba berikut untuk memastikan seluruh sistem berjalan normal:

| Komponen | Endpoint / URL | Kriteria Lolos |
|---|---|---|
| **Backend Health** | `GET /api/v1/health` | HTTP 200 `{ "status": "healthy", "motherduck": "connected", "supabase": "connected" }` |
| **OEE Analytics** | `GET /api/v1/oee/overview` | Mengembalikan ringkasan OEE lini dari MotherDuck |
| **Invoice Triad** | `GET /api/v1/invoice-matching/overview` | Mengembalikan 150 transaksi rekonsiliasi |
| **AI SSE Stream** | `POST /api/v1/chat/sessions/{id}/messages` | Token teks mengalir secara streaming tanpa buffer timeout |
| **Frontend UI** | `https://scic.indoprima.com/dashboard` | Tampilan Control Tower memuat seluruh kartu KPI, Risk Radar, dan grafik |
