import json

from app.services.mock_data_service import mock_data_service
from openai import AsyncOpenAI
from app.core.config import settings
from app.schemas.ai import ChatMessage

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None


def _build_dashboard_context() -> str:
    data = mock_data_service.get_current_data()
    scenario = mock_data_service.current_scenario
    return f"""
Current dashboard scenario: {scenario}
Transport metrics: {data.get("transport")}
Ecology metrics: {data.get("ecology")}
Alerts: {data.get("alerts")}
""".strip()

async def generate_ai_insights() -> dict:
    data = mock_data_service.get_current_data()
    scenario = mock_data_service.current_scenario
    
    # Simple hardcoded fallback if no API key
    if not client or not settings.OPENAI_API_KEY:
        if scenario == "normal":
            return {
                "summary": "Город функционирует в штатном режиме. Все показатели транспорта и экологии в пределах нормы.",
                "criticality": "Низкая",
                "recommendations": "Продолжайте стандартный мониторинг."
            }
        elif scenario == "moderate":
            return {
                "summary": "Замечены умеренные проблемы с трафиком в Центре и качеством воздуха.",
                "criticality": "Средняя",
                "recommendations": "Оптимизируйте графики работы светофоров и предупредите население о качестве воздуха."
            }
        else:
            return {
                "summary": "Обнаружена критическая ситуация в нескольких районах. Сильные заторы и опасный уровень PM2.5.",
                "criticality": "Высокая",
                "recommendations": "Немедленно разверните дополнительные посты ДПС и выпустите общегородское предупреждение о вреде для здоровья."
            }

    prompt = f"""
    You are an AI assistant for a Smart City Management Dashboard.
    Provide all responses in RUSSIAN.
    Current data:
    Transport: {data.get("transport")}
    Ecology: {data.get("ecology")}
    Alerts: {data.get("alerts")}

    Provide a short JSON response with the following keys:
    "summary": A 2-sentence summary of what is happening in RUSSIAN.
    "criticality": "Низкая", "Средняя", or "Высокая".
    "recommendations": A 2-sentence recommendation of what actions to take in RUSSIAN.
    """

    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" },
            temperature=0.3
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {
            "summary": "Ошибка генерации AI.",
            "criticality": "Неизвестно",
            "recommendations": str(e)
        }


async def generate_chat_response(messages: list[ChatMessage]) -> ChatMessage:
    latest_user_message = next(
        (message.content for message in reversed(messages) if message.role == "user"),
        ""
    )

    if not client or not settings.OPENAI_API_KEY:
        fallback_message = (
            "Чат подключен, но для ответов OpenAI нужно указать OPENAI_API_KEY в backend/.env. "
            "После этого я смогу отвечать по текущим данным дашборда и активному сценарию. "
            f"Последний запрос: {latest_user_message}"
        )
        return ChatMessage(role="assistant", content=fallback_message)

    system_prompt = f"""
You are an AI operator assistant for a Smart City Management Dashboard.
Answer in Russian only.
Be concise, practical, and specific.
Use the dashboard data below as the primary context for your answers.
If the user asks for recommendations, provide concrete city operations advice.
If you are uncertain, say what extra data would help.

{_build_dashboard_context()}
""".strip()

    completion_messages = [
        {"role": "system", "content": system_prompt},
        *[message.model_dump() for message in messages],
    ]

    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_CHAT_MODEL,
            messages=completion_messages,
            temperature=0.4,
        )
        content = response.choices[0].message.content or "Не удалось получить ответ от модели."
        return ChatMessage(role="assistant", content=content)
    except Exception as exc:
        return ChatMessage(
            role="assistant",
            content=(
                "Не удалось получить ответ от OpenAI. "
                f"Проверьте ключ API, модель и доступ к сети. Детали: {exc}"
            ),
        )
