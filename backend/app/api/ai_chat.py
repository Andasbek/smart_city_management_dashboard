from fastapi import APIRouter

from app.schemas.ai import ChatRequest, ChatResponse
from app.services.ai_service import generate_chat_response

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat_with_ai(payload: ChatRequest):
    message = await generate_chat_response(payload.messages)
    return ChatResponse(message=message)
