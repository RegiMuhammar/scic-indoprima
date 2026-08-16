# API Reference & Technical Contract — SCIC PT Indoprima
> **Base URL:** `/api/v1`  
> **Protocol:** HTTPS (REST) & Server-Sent Events (SSE)  
> **Authentication:** Supabase JWT Bearer Token (`Authorization: Bearer <token>`)  
> **Status:** Final API Specification v1.0  

---

## 1. Konvensi Umum & Response Envelope

Semua respons API dibungkus dalam format standar untuk memastikan interoperabilitas antara backend FastAPI (Pydantic v2) dan frontend Next.js (Zod schemas):

### 1.1 Success Response Wrapper
```json
{
  "data": { ... },
  "meta": {
    "total": 120,
    "limit": 20,
    "offset": 0,
    "timestamp": "2026-08-16T14:00:00Z"
  }
}
```

### 1.2 Error Response Wrapper
```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "Transaksi dengan PO-77820-PT tidak ditemukan",
    "details": {}
  }
}
```

---

## 2. Dashboard Analytics & Control Tower

### 2.1 GET `/api/v1/dashboard/executive-summary`
* **Query Params:** `plant_id` *(optional, string)*
* **Response `data`:**
  ```json
  {
    "health_index": 78.4,
    "status_label": "Needs Attention",
    "ai_summary_text": "Supply Chain Health Index berada pada skor 78.4 (Needs Attention). Terdeteksi potensi keterlambatan pada 8 delivery orders senilai $184.000 akibat downtime kalibrasi hidrolik di Pabrik Karawang.",
    "critical_issue_count": 2,
    "at_risk_order_count": 8,
    "updated_at": "2026-08-16T13:45:00Z"
  }
  ```

### 2.2 GET `/api/v1/dashboard/kpis`
* **Query Params:** `period` *(string, default 'current')*, `plant_id` *(optional)*
* **Response `data`:**
  ```json
  {
    "on_time_delivery": { "value": 84.2, "target": 92.0, "delta_pct": -3.1, "trend": "down", "status": "warning" },
    "production_achievement": { "value": 88.5, "target": 95.0, "delta_pct": -1.8, "trend": "down", "status": "danger" },
    "forecast_accuracy": { "value": 91.2, "target": 90.0, "delta_pct": 1.4, "trend": "up", "status": "good" },
    "global_oee": { "value": 82.6, "target": 85.0, "delta_pct": 0.8, "trend": "up", "status": "warning" }
  }
  ```

### 2.3 GET `/api/v1/dashboard/insights`
* **Query Params:** `priority` *(Critical|High|Medium)*, `limit` *(int)*, `offset` *(int)*
* **Response `data`:** Array of `ai_insight_log`:
  ```json
  [
    {
      "insight_id": "INS-001",
      "module": "Dashboard",
      "priority": "Critical",
      "title": "Unscheduled Hydraulic Calibration di Line 3",
      "summary": "Line 3 Stamping Press mengalami downtime 14 jam menyebabkan backlog 1.200 unit.",
      "contributing_factors": ["Vibration anomaly spike", "Hydraulic seal wear", "Delayed spare part arrival"],
      "confidence_score": 94.0,
      "business_impact": "Potensi penalti keterlambatan OEM $42.000",
      "recommended_action": "Alihkan alokasi produksi ke Line 1 dan prioritaskan WO-2026-0881."
    }
  ]
  ```

### 2.4 GET `/api/v1/dashboard/risk-events`
* **Query Params:** `level` *(Critical|High|Medium|Low)*, `status` *(Pending|Acknowledged)*
* **Response `data`:** Array of `risk_event` records.

---

## 3. Manufacturing Productivity (OEE)

### 3.1 GET `/api/v1/oee/overview`
* **Response `data`:** Ringkasan OEE per lini produksi dari view MotherDuck:
  ```json
  {
    "plant_oee": 83.4,
    "lines": [
      {
        "line_id": "LINE-LS-01",
        "line_name": "Leaf Spring Line 01 (Gresik)",
        "target_oee_pct": 85.0,
        "availability_pct": 89.2,
        "performance_pct": 94.1,
        "quality_pct": 98.6,
        "overall_oee_pct": 82.8
      }
    ]
  }
  ```

### 3.2 GET `/api/v1/oee/downtime-pareto`
* **Query Params:** `line_id` *(optional)*, `days` *(int, default 30)*
* **Response `data`:** 6 Big Losses breakdown (Unplanned Breakdown, Changeover, Planned Maintenance, Tooling Setup, Speed Loss).

### 3.3 GET `/api/v1/oee/telemetry/{machine_id}`
* **Query Params:** `hours` *(int, default 24)*
* **Response `data`:** Time-series telemetry (vibration, temperature, current, RPM, machine state).

---

## 4. Invoice Matching Intelligence

### 4.1 GET `/api/v1/invoice-matching/overview`
* **Response `data`:**
  ```json
  {
    "total_transactions": 150,
    "auto_matched": 128,
    "partial_match": 14,
    "discrepancies": 8,
    "pending_review": 6,
    "match_rate_pct": 94.6,
    "avg_confidence_score": 96.2
  }
  ```

### 4.2 GET `/api/v1/invoice-matching/transactions`
* **Query Params:** `status` *(Matched|Partial Match|Mismatch)*, `search` *(string)*, `limit`, `offset`
* **Response `data`:** Array of 3-way matching records (PO, Invoice ID, Resi, Supplier, Amount, Confidence Score, Exception Tag).

### 4.3 GET `/api/v1/invoice-matching/transactions/{po_number}`
* **Response `data`:** Perbandingan detail field-level (Supplier, Product, Qty, Amount) dengan badge MATCH/MISMATCH dan narasi penjelasan AI.

### 4.4 POST `/api/v1/invoice-matching/transactions/{po_number}/review`
* **Body (JSON):**
  ```json
  {
    "decision": "Approved",
    "note": "Selisih 50 unit diakomodasi melalui PO amendement #PO-77820-A."
  }
  ```
* **Response `data`:** `{ "success": true, "audit_log_id": "LOG-2026-0912" }` *(Menulis record ke Supabase Postgres `audit_log`)*.

---

## 5. Demand, Stock Balancing & Spare Part Readiness

### 5.1 GET `/api/v1/demand/overview`
* **Query Params:** `sku_id` *(string, required)*
* **Response `data`:** Current Demand, On-hand Qty, Days of Supply, Forecast Confidence, Projected Stockout Date, Suggested Replenishment Qty.

### 5.2 GET `/api/v1/demand/forecast`
* **Query Params:** `sku_id` *(string)*, `horizon` *(30|60|90)*
* **Response `data`:**
  ```json
  {
    "sku_id": "PRD-001",
    "historical_series": [{ "period": "2026-01", "actual_qty": 4200 }],
    "forecast_series": [{ "period": "2026-08", "forecast_qty": 4650, "range_low": 4300, "range_high": 5000 }],
    "confidence_score": 88.0,
    "positive_drivers": ["Toyota Q3 assembly line ramp-up (+14%)"],
    "risk_drivers": ["Raw steel material price volatility"]
  }
  ```

### 5.3 GET `/api/v1/inventory/stock-balancing/candidates`
* **Response `data`:** Daftar kandidat SKU dengan overstock di Karawang dan krisis stok di Surabaya beserta total valuasi ketidakseimbangan (Rp 23,3 M).

### 5.4 POST `/api/v1/inventory/stock-balancing/transfers/{transfer_id}/approve`
* **Body (JSON):** `{ "decision": "Approved", "note": "Disetujui relokasi 500 unit ke Surabaya." }`

### 5.5 GET `/api/v1/demand/spareparts/reorder-recommendations`
* **Response `data`:** Rekomendasi reorder suku cadang kritis berbasis kalkulasi dynamic safety stock & lead time supplier.

---

## 6. AI Assistant Copilot & Streaming

### 6.1 POST `/api/v1/chat/sessions`
* **Body:** `{ "title": "Investigasi Downtime Line 3" }`
* **Response `data`:** `{ "session_id": "sess_882910a", "created_at": "2026-08-16T14:00:00Z" }`

### 6.2 GET `/api/v1/chat/sessions`
* **Response `data`:** List sesi percakapan user dari Supabase PostgreSQL.

### 6.3 POST `/api/v1/chat/sessions/{session_id}/messages`
* **Transport:** Server-Sent Events (SSE) streaming stream response.
* **Body:** `{ "content": "Mengapa OEE di Line 3 turun drastis minggu ini?" }`
* **Stream Events:**
  1. `event: metadata` -> `{ "tool_called": "text_to_sql", "sql": "SELECT ... FROM fact_downtime_logs ..." }`
  2. `event: token` -> `"Line "` ... `"3 "` ... `"mengalami "` ...
  3. `event: done` ->
     ```json
     {
       "direct_answer": "OEE Line 3 turun menjadi 74.2% akibat unplanned downtime 14 jam pada stamping press...",
       "supporting_metrics": { "oee_current": 74.2, "downtime_hours": 14 },
       "contributing_factors": ["Hydraulic pump failure", "Delay part PRT-HYD-01"],
       "confidence_score": 95.0,
       "recommended_action": "Jadwalkan emergency repair dan order replacement seal."
     }
     ```

---

## 7. AI Governance & Connection Monitor

### 7.1 GET `/api/v1/agent/logs`
* **Query Params:** `session_id`, `limit`, `offset`
* **Response `data`:** Execution traces: latency, tokens, tool calling, generated SQL, dan confidence score.

### 7.2 GET `/api/v1/system/connections`
* **Response `data`:** Status kesehatan koneksi simulasi SAP ERP, Indoprima WMS, E-Procurement Portal, dan Tanjung Perak Port Telemetry.
