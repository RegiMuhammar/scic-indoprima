"""
Chat Repository — Supabase PostgreSQL persistence for sessions, messages, and audit logs.
"""
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from supabase import create_client, Client
from app.core.config import settings
from app.schemas.chat import (
    ChatSessionResponse,
    ChatMessageResponse,
    ActionStepItem,
    ExplainabilityPayload,
    VisualizationPayload
)

def get_supabase_client() -> Client:
    """Instantiates Supabase client."""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_ANON_KEY
    )


class ChatRepository:
    def __init__(self):
        self.client = get_supabase_client()

    # ── SESSIONS ─────────────────────────────────────────────────────────────

    def create_session(self, title: str = "Percakapan Baru", domain: str = "general", user_id: str = "anonymous_user") -> Dict[str, Any]:
        """Creates a new chat session."""
        res = self.client.table("chat_sessions").insert({
            "title": title,
            "domain": domain,
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).execute()
        
        if res.data and len(res.data) > 0:
            return res.data[0]
        raise Exception("Gagal membuat sesi percakapan di Supabase.")

    def list_sessions(self, user_id: str = "anonymous_user") -> List[Dict[str, Any]]:
        """Lists chat sessions ordered by updated_at descending."""
        try:
            res = self.client.table("chat_sessions") \
                .select("*") \
                .order("created_at", desc=True) \
                .limit(50) \
                .execute()
            return res.data or []
        except Exception as e:
            print(f"Error listing sessions: {e}")
            return []

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single session by id."""
        try:
            res = self.client.table("chat_sessions").select("*").eq("id", session_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
            return None
        except Exception:
            return None

    def update_session_title(self, session_id: str, title: str) -> None:
        """Updates session title and updated_at timestamp."""
        try:
            self.client.table("chat_sessions").update({
                "title": title,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }).eq("id", session_id).execute()
        except Exception as e:
            print(f"Error updating session title: {e}")

    def delete_session(self, session_id: str) -> bool:
        """Deletes a chat session and all its messages (cascade)."""
        try:
            self.client.table("chat_sessions").delete().eq("id", session_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting session: {e}")
            return False

    # ── MESSAGES ─────────────────────────────────────────────────────────────

    def create_message(
        self,
        session_id: str,
        role: str,
        content: str,
        sql_query: Optional[str] = None,
        sql_result: Optional[List[Dict[str, Any]]] = None,
        action_steps: Optional[List[str]] = None,
        expert_critique: Optional[Dict[str, Any]] = None,
        explainability: Optional[Dict[str, Any]] = None,
        visualization: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Inserts a user or assistant chat message."""
        payload = {
            "session_id": session_id,
            "role": role,
            "content": content,
            "sql_query": sql_query,
            "sql_result": sql_result,
            "action_steps": action_steps or [],
            "expert_critique": expert_critique,
            "explainability": explainability,
            "visualization": visualization,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        res = self.client.table("chat_messages").insert(payload).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        raise Exception("Gagal menyimpan pesan chat ke Supabase.")

    def get_messages(self, session_id: str) -> List[Dict[str, Any]]:
        """Retrieves all messages for a session ordered by created_at ascending."""
        try:
            res = self.client.table("chat_messages") \
                .select("*") \
                .eq("session_id", session_id) \
                .order("created_at", desc=False) \
                .execute()
            return res.data or []
        except Exception as e:
            print(f"Error getting messages: {e}")
            return []

    # ── AUDIT LOGS ───────────────────────────────────────────────────────────

    def log_agent_node(
        self,
        session_id: Optional[str],
        node_name: str,
        input_payload: Any,
        output_payload: Any,
        execution_time_ms: float,
        error_message: Optional[str] = None
    ) -> None:
        """Logs node execution for auditability & explainability."""
        try:
            self.client.table("agent_logs").insert({
                "session_id": session_id,
                "node_name": node_name,
                "input_payload": input_payload if isinstance(input_payload, (dict, list)) else {"raw": str(input_payload)},
                "output_payload": output_payload if isinstance(output_payload, (dict, list)) else {"raw": str(output_payload)},
                "execution_time_ms": execution_time_ms,
                "error_message": error_message,
                "created_at": datetime.now(timezone.utc).isoformat()
            }).execute()
        except Exception as e:
            print(f"Warning: Failed to write agent audit log: {e}")


# Singleton instance
chat_repository = ChatRepository()
