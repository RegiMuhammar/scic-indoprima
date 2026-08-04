"""AI Chat API — RAG + Text-to-SQL Agent (LangGraph)"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.get("/sessions")
async def list_sessions():
    # TODO: List user chat sessions from Supabase
    return {"sessions": []}

@router.post("/sessions")
async def create_session():
    # TODO: Create a new chat session
    return {"session_id": ""}

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    # TODO: Delete chat session and messages
    return {"status": "deleted"}

@router.get("/sessions/{session_id}/messages")
async def get_messages(session_id: str):
    # TODO: Return persisted messages for a session
    return {"messages": []}

@router.post("/sessions/{session_id}/messages")
async def send_message(session_id: str):
    # TODO: Run LangGraph agent and stream response via SSE
    pass
