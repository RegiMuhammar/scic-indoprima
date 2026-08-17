"""
Pydantic Schemas for AI Chat Copilot & NL2SQL Agent — SCIC Indoprima
Enforces strict type validation, LLM structured outputs, and API response contracts.
"""
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


# ── 1. Action Steps & Transparency ──────────────────────────────────────────

class ActionStepItem(BaseModel):
    id: str = Field(description="Unique step identifier, e.g. step_1")
    title: str = Field(description="Step title, e.g. 'Schema lookup'")
    description: str = Field(description="Human readable progress description, e.g. '-> Ran Query DuckDB...'")
    status: Literal["pending", "running", "completed", "failed"] = "completed"
    timestamp: Optional[str] = None


class SQLTransparencyData(BaseModel):
    query: str = Field(description="Sanitized executable DuckDB SQL query")
    execution_time_ms: float = Field(default=0.0, description="Query execution duration in milliseconds")
    row_count: int = Field(default=0, description="Number of rows returned")
    source_tables: List[str] = Field(default_factory=list, description="List of source tables queried")


class VisualizationPayload(BaseModel):
    chart_type: Literal["bar_chart", "line_chart", "donut_chart", "table", "kpi_card", "none"] = "none"
    title: str = ""
    x_axis: Optional[str] = None
    y_axis: Optional[str] = None
    series: Optional[List[str]] = None
    data: List[Dict[str, Any]] = Field(default_factory=list)


class ExplainabilityPayload(BaseModel):
    primary_kpi: Optional[str] = None
    delta_vs_target: Optional[str] = None
    financial_exposure: Optional[str] = None
    contributing_factors: List[Dict[str, Any]] = Field(default_factory=list)
    confidence_score: float = Field(ge=0.0, le=100.0, default=95.0)
    grounding_sources: List[str] = Field(default_factory=list)
    recommended_action: Optional[str] = None


# ── 2. LLM Structured Outputs ───────────────────────────────────────────────

class RouterPlanOutput(BaseModel):
    intent: Literal[
        "ANALYTICS_QUERY",
        "FOLLOW_UP_INTERPRETATION",
        "CLARIFICATION_NEEDED",
        "OUT_OF_SCOPE",
        "SOP_KNOWLEDGE",
        "CROSS_DOMAIN_EXECUTIVE",
        "CHIT_CHAT",
        "UNSAFE"
    ] = Field(
        description="Classification of user intent"
    )
    selected_domain: Literal[
        "manufacturing",
        "supply_chain",
        "inventory_mro",
        "finance",
        "executive_cross_domain",
        "general"
    ] = Field(description="Target business domain for schema scoping")
    normalized_query: Optional[str] = Field(
        default=None,
        description="Self-contained disambiguated business query standardizing user terms and resolving conversation context"
    )
    clarification_prompt: Optional[str] = Field(
        default=None,
        description="Polite clarifying questions / menu options if intent is CLARIFICATION_NEEDED"
    )
    reasoning: str = Field(description="Brief explanation of routing decision")
    target_tables_hint: List[str] = Field(default_factory=list, description="Initial list of tables likely needed")


class SeniorExpertCritique(BaseModel):
    score: float = Field(ge=0.0, le=100.0, description="Overall quality & grounding score (0-100)")
    status: Literal["PASSED", "NEEDS_REFINEMENT", "CRITICAL_ERROR"] = Field(
        description="Whether the draft answer meets senior executive standards"
    )
    data_grounding_verified: bool = Field(description="True if all metrics match query results 100%")
    operational_root_cause: str = Field(description="Identified operational root cause (e.g. line/machine/vendor)")
    actionable_recommendations: List[str] = Field(default_factory=list, description="Tactical advice for plant/supply chain leads")
    refinement_feedback: Optional[str] = Field(default=None, description="Actionable critique instructions if score < 80")


class SQLValidationResult(BaseModel):
    is_valid: bool = Field(description="Whether query passed AST and engine binding checks")
    sanitized_sql: Optional[str] = Field(default=None, description="Cleaned SQL with LIMIT injection")
    error_type: Optional[Literal["ok", "syntax_error", "mutation_blocked", "unauthorized_table", "binder_error", "timeout"]] = "ok"
    error_message: Optional[str] = None
    tables_referenced: List[str] = Field(default_factory=list)


# ── 3. Chat Session DTOs ───────────────────────────────────────────────────

class ChatSessionCreate(BaseModel):
    title: Optional[str] = Field(default="Percakapan Baru", max_length=255)
    domain: Optional[str] = Field(default="general", max_length=50)


class ChatSessionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)


class ChatSessionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    domain: str
    created_at: str
    updated_at: str


class ChatSessionListResponse(BaseModel):
    sessions: List[ChatSessionResponse]


# ── 4. Chat Message DTOs ───────────────────────────────────────────────────

class ChatMessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000, description="User prompt text")
    domain_override: Optional[str] = Field(default=None, description="Optional manual domain override")


class ChatMessageResponse(BaseModel):
    id: str
    session_id: str
    role: Literal["user", "assistant", "system"]
    content: str
    sql_query: Optional[str] = None
    sql_result: Optional[List[Dict[str, Any]]] = None
    action_steps: List[Any] = Field(default_factory=list)
    expert_critique: Optional[Dict[str, Any]] = None
    explainability: Optional[Dict[str, Any]] = None
    visualization: Optional[Dict[str, Any]] = None
    created_at: str


class ChatMessageListResponse(BaseModel):
    messages: List[ChatMessageResponse]


# ── 5. Golden Demo Presets DTOs ─────────────────────────────────────────────

class DemoPresetItem(BaseModel):
    id: str
    category: str = Field(description="Domain category, e.g. 'Manufaktur & OEE'")
    badge_icon: str = Field(description="Icon identifier, e.g. 'factory', 'settings', 'truck'")
    prompt: str = Field(description="Natural language question")
    subtitle: str = Field(description="Short description of what this analyzes")
    target_sql: str = Field(description="Pre-verified target DuckDB query")
    domain: str = Field(description="Domain key, e.g. 'manufacturing'")


class DemoPresetsResponse(BaseModel):
    presets: List[DemoPresetItem]
