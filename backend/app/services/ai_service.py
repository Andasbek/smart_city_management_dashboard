from app.services.mock_data_service import mock_data_service
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

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
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" },
            temperature=0.3
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {
            "summary": "Ошибка генерации AI.",
            "criticality": "Неизвестно",
            "recommendations": str(e)
        }
