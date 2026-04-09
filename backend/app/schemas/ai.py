from pydantic import BaseModel

class AIInsight(BaseModel):
    summary: str
    criticality: str
    recommendations: str
