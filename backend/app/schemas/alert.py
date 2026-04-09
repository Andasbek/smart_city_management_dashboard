from pydantic import BaseModel
from typing import List

class Alert(BaseModel):
    id: str
    type: str  # e.g., "WARNING", "CRITICAL"
    direction: str  # "Transport" or "Ecology"
    district_name: str
    severity: str # "High", "Medium", "Low"
    message: str
    recommendation: str

class AlertResponse(BaseModel):
    alerts: List[Alert]
