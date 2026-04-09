from pydantic import BaseModel
from typing import List

class EcologyMetric(BaseModel):
    id: str
    district_name: str
    timestamp: str
    aqi: int
    pm25: float
    pm10: float
    temperature: float
    risk_level: str
    status: str

class EcologyResponse(BaseModel):
    metrics: List[EcologyMetric]
