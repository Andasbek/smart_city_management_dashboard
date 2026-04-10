from pydantic import BaseModel
from typing import List

class CitySummary(BaseModel):
    transport_status: str
    ecology_status: str
    active_alerts: int
    overall_risk_level: str
    kpi_score: int

class TrendPoint(BaseModel):
    label: str
    kpi: int
    transport_load: int
    ecology_aqi: int
    alerts_count: int

class TrendsResponse(BaseModel):
    scenario: str
    points: List[TrendPoint]
