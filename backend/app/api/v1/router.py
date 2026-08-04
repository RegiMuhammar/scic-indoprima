"""API v1 Router — aggregates all route modules"""
from fastapi import APIRouter
from app.api.v1 import dashboard, invoice, demand, chat, agent_logs, data_connections

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(invoice.router, prefix="/invoices", tags=["Invoice Matching"])
api_router.include_router(demand.router, prefix="/demand", tags=["Demand Intelligence"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat"])
api_router.include_router(agent_logs.router, prefix="/agent-logs", tags=["Agent Logs"])
api_router.include_router(data_connections.router, prefix="/connections", tags=["Data Connections"])
