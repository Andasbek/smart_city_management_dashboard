from fastapi import APIRouter
from app.schemas.ai import AIInsight
from app.services.ai_service import generate_ai_insights

router = APIRouter()

@router.get("/", response_model=AIInsight)
async def get_ai_insights():
    insights = await generate_ai_insights()
    return AIInsight(**insights)
