"""Pydantic schemas for chat sessions and messages"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatSessionCreate(BaseModel):
    title: Optional[str] = None

class ChatMessageCreate(BaseModel):
    content: str
    role: str = "user"
