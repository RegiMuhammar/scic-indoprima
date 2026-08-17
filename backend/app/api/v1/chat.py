"""
AI Chat API — Streaming SSE & Supabase Sessions Endpoints
SCIC Indoprima AI Copilot
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import Optional, List

from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionListResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatMessageListResponse,
    DemoPresetsResponse
)
from app.ai.tools.demo_presets import get_all_presets, get_presets_by_domain
from app.repositories.chat_repository import chat_repository
from app.services.chat_service import chat_service

router = APIRouter()


# ── 1. Demo Presets Catalog ──────────────────────────────────────────────────

@router.get("/presets", response_model=DemoPresetsResponse)
async def list_demo_presets(domain: Optional[str] = Query(None)):
    """Returns curated golden demo query templates."""
    presets = get_presets_by_domain(domain) if domain else get_all_presets()
    return DemoPresetsResponse(presets=presets)


# ── 2. Session Management ────────────────────────────────────────────────────

@router.get("/sessions", response_model=ChatSessionListResponse)
async def list_sessions(user_id: str = Query("anonymous_user")):
    """Returns all chat sessions for the active user."""
    sessions = chat_repository.list_sessions(user_id=user_id)
    return ChatSessionListResponse(
        sessions=[
            ChatSessionResponse(
                id=str(s["id"]),
                user_id=str(s.get("user_id", "anonymous_user")),
                title=str(s.get("title", "Percakapan Baru")),
                domain=str(s.get("domain", "general")),
                created_at=str(s.get("created_at", "")),
                updated_at=str(s.get("updated_at", ""))
            )
            for s in sessions
        ]
    )


@router.post("/sessions", response_model=ChatSessionResponse)
async def create_session(body: ChatSessionCreate):
    """Creates a new empty chat session."""
    try:
        new_s = chat_repository.create_session(
            title=body.title or "Percakapan Baru",
            domain=body.domain or "general"
        )
        return ChatSessionResponse(
            id=str(new_s["id"]),
            user_id=str(new_s.get("user_id", "anonymous_user")),
            title=str(new_s["title"]),
            domain=str(new_s["domain"]),
            created_at=str(new_s["created_at"]),
            updated_at=str(new_s["updated_at"])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session_detail(session_id: str):
    """Retrieves session metadata."""
    session = chat_repository.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sesi percakapan tidak ditemukan.")
    return ChatSessionResponse(
        id=str(session["id"]),
        user_id=str(session.get("user_id", "anonymous_user")),
        title=str(session.get("title", "Percakapan Baru")),
        domain=str(session.get("domain", "general")),
        created_at=str(session.get("created_at", "")),
        updated_at=str(session.get("updated_at", ""))
    )


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Deletes a chat session and cascades all messages."""
    success = chat_repository.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Gagal menghapus sesi percakapan.")
    return {"status": "deleted", "session_id": session_id}


# ── 3. Chat Messages & SSE Streaming ─────────────────────────────────────────

@router.get("/sessions/{session_id}/messages", response_model=ChatMessageListResponse)
async def get_session_messages(session_id: str):
    """Returns conversation history for a given session."""
    raw_messages = chat_repository.get_messages(session_id)
    parsed_messages: List[ChatMessageResponse] = []
    
    for m in raw_messages:
        parsed_messages.append(
            ChatMessageResponse(
                id=str(m["id"]),
                session_id=str(m["session_id"]),
                role=m["role"],
                content=m["content"],
                sql_query=m.get("sql_query"),
                sql_result=m.get("sql_result"),
                action_steps=m.get("action_steps") or [],
                expert_critique=m.get("expert_critique"),
                explainability=m.get("explainability"),
                visualization=m.get("visualization"),
                created_at=str(m.get("created_at", ""))
            )
        )
        
    return ChatMessageListResponse(messages=parsed_messages)


@router.post("/sessions/{session_id}/messages")
async def send_message_and_stream(session_id: str, body: ChatMessageCreate):
    """
    Submits user message, invokes LangGraph Multi-Tier Agent, and streams Server-Sent Events (SSE).
    """
    session = chat_repository.get_session(session_id)
    if not session:
        # Create session automatically if ID doesn't exist yet
        try:
            chat_repository.create_session(
                title=(body.content[:45] + "...") if len(body.content) > 45 else body.content,
                domain=body.domain_override or "general"
            )
        except Exception:
            pass

    return StreamingResponse(
        chat_service.stream_agent_execution(
            session_id=session_id,
            user_prompt=body.content,
            domain_override=body.domain_override
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
