from pydantic import BaseModel
from typing import List, Optional

class CitySummary(BaseModel):
    transport_status: str
    ecology_status: str
    active_alerts: int
    overall_risk_level: str
    kpi_score: int
