# Metrics Specification — AI Copilot, Explainability & Governance
> **Route:** `/chat`, `/agent-logs`, `/explainability`  
> **Target Role:** All Roles, AI System Auditor, Compliance Lead  
> **Database:** Supabase PostgreSQL (`public.chat_*`, `public.agent_*`, `public.audit_log`)  

---

## 1. AI Copilot Performance & Trust Metrics

### 1.1 Query Response Latency (P95)
* **Target:** $< 5.0\text{ Detik}$
* **Komponen:**
  * Intent Classification & Routing: $< 500\text{ ms}$
  * Text-to-SQL Generation & SQLGlot Validation: $< 1.2\text{ s}$
  * MotherDuck OLAP Execution: $< 800\text{ ms}$
  * LLM Synthesis & Streaming (Groq Llama 3.3 70B): $< 2.0\text{ s}$

### 1.2 SQL Correctness Rate (%)
* **Target:** $\ge 95.0\%$ (Evaluasi otomatis terhadap golden query benchmark).

### 1.3 Hallucination Rate (%)
* **Target:** $< 5.0\%$ (Verifikasi grounding data sumber melalui LLM-as-Judge).

---

## 2. AI Explainability Structure

Setiap respons analitik dari AI wajib mengembalikan 5 atribut wajib:
```json
{
  "direct_answer": "Ringkasan jawaban lugas dan berbasis data konkret.",
  "supporting_metrics": {
    "primary_kpi": 84.2,
    "delta_vs_target": -7.8,
    "financial_exposure_usd": 184000
  },
  "contributing_factors": [
    { "factor": "Hydraulic Stamping Calibration Delay", "weight": 0.55 },
    { "factor": "Tanjung Perak Port Customs Backlog", "weight": 0.30 },
    { "factor": "Supplier Material Delay (Steelindo)", "weight": 0.15 }
  ],
  "confidence_score": 94.0,
  "grounding_sources": ["fact_downtime_logs", "delivery_order", "logistics_telemetry"],
  "recommended_action": "Alihkan order prioritas ke Line 1 dan ajukan pre-clearance pelabuhan."
}
```

---

## 3. Human-in-the-Loop Governance & Audit Metrics

### 3.1 Human Approval Rate (%)
* **Formula:** $\frac{\sum \text{Decisions (Approved + Adjusted)}}{\sum \text{Total Decisions}} \times 100$
* **Target:** $\ge 80.0\%$
* **Query SQL (Supabase PostgreSQL):**
  ```sql
  SELECT 
      module,
      COUNT(*) AS total_proposals,
      COUNT(*) FILTER (WHERE human_decision = 'Approved') AS approved_count,
      COUNT(*) FILTER (WHERE human_decision = 'Adjusted') AS adjusted_count,
      COUNT(*) FILTER (WHERE human_decision = 'Rejected') AS rejected_count,
      ROUND(100.0 * COUNT(*) FILTER (WHERE human_decision IN ('Approved', 'Adjusted')) / COUNT(*), 1) AS human_adoption_rate_pct
  FROM audit_log
  GROUP BY module;
  ```
