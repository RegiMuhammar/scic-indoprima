// Chat domain types for SCIC AI Copilot

export interface ActionStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed" | "failed"
  timestamp?: string
}

export interface SQLTransparency {
  query: string
  execution_time_ms: number
  row_count: number
  source_tables: string[]
}

export interface VisualizationPayload {
  chart_type: "bar_chart" | "line_chart" | "donut_chart" | "table" | "kpi_card" | "none"
  title: string
  x_axis?: string
  y_axis?: string
  series?: string[]
  data: Record<string, any>[]
}

export interface ExplainabilityData {
  primary_kpi?: string
  delta_vs_target?: string
  financial_exposure?: string
  contributing_factors?: { factor: string; weight: number }[]
  confidence_score: number
  grounding_sources: string[]
  recommended_action?: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: "user" | "assistant" | "system"
  content: string
  sql_query?: string
  sql_result?: Record<string, any>[]
  action_steps?: string[] | ActionStep[]
  expert_critique?: Record<string, any>
  explainability?: ExplainabilityData
  visualization?: VisualizationPayload
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  domain: string
  created_at: string
  updated_at: string
}

export interface DemoPreset {
  id: string
  category: string
  badge_icon: string
  prompt: string
  subtitle: string
  target_sql: string
  domain: string
}
