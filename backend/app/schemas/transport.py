from pydantic import BaseModel
from typing import List

class TransportMetric(BaseModel):
    id: str
    district_name: str
    timestamp: str
    traffic_load: int
    avg_speed: int
    incidents_count: int
    congestion_level: str
    status: str

class TransportResponse(BaseModel):
    metrics: List[TransportMetric]
