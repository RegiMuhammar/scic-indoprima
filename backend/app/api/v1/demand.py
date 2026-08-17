"""Demand & Inventory Decision Intelligence API Endpoints"""
from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.services.demand_service import get_demand_summary, calculate_scenario

router = APIRouter()


class ScenarioRequest(BaseModel):
    demand_surge_pct: float = 0.0
    lead_time_delay_days: int = 0


@router.get("/summary")
async def get_demand_intelligence_summary():
    """Retrieve full analytics summary for Demand & Spare Part Decision Intelligence."""
    return get_demand_summary()


@router.post("/scenario")
async def run_demand_scenario(payload: ScenarioRequest):
    """Run real-time scenario simulation for demand surge and lead time delay."""
    return calculate_scenario(
        demand_surge_pct=payload.demand_surge_pct,
        lead_time_delay_days=payload.lead_time_delay_days,
    )
