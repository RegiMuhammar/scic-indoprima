"""Demand & Inventory Decision Intelligence API Endpoints"""
from fastapi import APIRouter
from app.services.demand_service import get_demand_summary

router = APIRouter()


@router.get("/summary")
async def get_demand_intelligence_summary():
    """Retrieve full analytics summary for Demand & Spare Part Decision Intelligence."""
    return get_demand_summary()
