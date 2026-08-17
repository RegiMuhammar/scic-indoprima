-- SCIC Indoprima — Supabase PostgreSQL Schema for AI Chat Copilot & Governance
-- Platform: Supabase PostgreSQL (public schema)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) DEFAULT 'anonymous_user',
    title VARCHAR(255) NOT NULL DEFAULT 'Percakapan Baru',
    domain VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    sql_query TEXT,
    sql_result JSONB,
    action_steps JSONB DEFAULT '[]'::jsonb,
    expert_critique JSONB,
    explainability JSONB,
    visualization JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Execution Trace Logs
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    node_name VARCHAR(100) NOT NULL,
    input_payload JSONB,
    output_payload JSONB,
    execution_time_ms FLOAT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Human-in-the-Loop Audit Log
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(50) NOT NULL DEFAULT 'ai_copilot',
    action VARCHAR(100) NOT NULL,
    human_decision VARCHAR(50) DEFAULT 'Approved',
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON public.chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_session ON public.agent_logs(session_id);
