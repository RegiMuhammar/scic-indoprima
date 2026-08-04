"""Pydantic schemas for dashboard KPIs and health score"""
from pydantic import BaseModel
from typing import List

class KPIItem(BaseModel):
    name: str
    value: float
    unit: str
    trend: str
    change_pct: float
