"""Dashboard API — Health Score, KPIs, AI Insights, Alerts & MotherDuck Summary"""
from fastapi import APIRouter, HTTPException
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter()

@router.get("/summary")
async def get_summary():
    """Returns complete real-time dashboard summary metrics from MotherDuck Cloud."""
    try:
        data = get_dashboard_summary()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard metrics: {str(e)}")

@router.get("/health-score")
async def get_health_score():
    data = get_dashboard_summary()
    return data.get("health_index", {})

@router.get("/kpis")
async def get_kpis():
    data = get_dashboard_summary()
    return data.get("scorecards", {})

@router.get("/insights")
async def get_ai_insights():
    data = get_dashboard_summary()
    return data.get("active_risks", [])

@router.get("/alerts")
async def get_alerts():
    data = get_dashboard_summary()
    return data.get("active_risks", [])
