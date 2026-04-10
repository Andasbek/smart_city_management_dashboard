# Smart City Management Dashboard

Демонстрационная платформа для управления умным городом: аналитика, мониторинг и AI-ассистент для ключевых направлений городской инфраструктуры. Состоит из FastAPI-бэкенда и Next.js-фронтенда.

## Возможности

- **Дашборд** — ключевые показатели города в реальном времени
- **Транспорт** — мониторинг транспортных потоков и загруженности
- **Экология** — отслеживание качества воздуха и других экологических метрик
- **Оповещения** — лента событий и инцидентов
- **Сценарии** — переключение между сценариями развития города
- **AI Insights** — автоматические аналитические выводы
- **AI Чат** — интеллектуальный помощник на базе OpenAI для анализа данных

## Технологии

**Backend**
- Python 3.10+
- FastAPI 0.111
- Pydantic 2 / pydantic-settings
- OpenAI SDK (для AI Chat и AI Insights)
- Uvicorn

**Frontend**
- Next.js 16
- React 19 + TypeScript
- Tailwind CSS 4
- Recharts (графики)
- lucide-react (иконки)

## Установка и запуск

### Требования

- Python 3.10 или выше
- Node.js 18 или выше
- (опционально) Ключ OpenAI API для функций AI Chat / AI Insights

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Создайте файл `backend/.env` и укажите ключ OpenAI (необязательно, но требуется для AI-функций):

```env
OPENAI_API_KEY=sk-...
OPENAI_CHAT_MODEL=gpt-4o-mini
```

Запустите сервер разработки:

```bash
uvicorn app.main:app --reload
```

API будет доступен на `http://localhost:8000`, интерактивная документация — на `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`.

## API endpoints

Все маршруты доступны под префиксом `/api`:

| Префикс | Описание |
| --- | --- |
| `/api/dashboard` | Основные KPI и сводные показатели |
| `/api/transport` | Данные по транспорту |
| `/api/ecology` | Экологические метрики |
| `/api/alerts` | Оповещения и инциденты |
| `/api/scenarios` | Сценарии развития города |
| `/api/ai-insights` | Автоматическая аналитика |
| `/api/ai-chat` | AI-ассистент (OpenAI) |

Полное описание endpoint-ов смотрите в [docs/api_reference.md](docs/api_reference.md) или в Swagger UI по адресу `/docs`.

## Структура проекта

```
smart_city_management_dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # Точка входа FastAPI
│   │   ├── api/                 # Роутеры (dashboard, transport, ecology, alerts, scenarios, ai_*)
│   │   ├── core/                # Конфигурация (config.py)
│   │   ├── data/                # Демонстрационные данные сценариев
│   │   ├── schemas/             # Pydantic-модели
│   │   └── services/            # Бизнес-логика (ai_service, mock_data_service)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                 # Маршруты Next.js (page.tsx, transport, ecology, alerts)
│   │   ├── components/          # KPISection, AIChatPanel, AIInsightsCard, AlertsPanel, ScenarioSwitcher
│   │   └── lib/                 # Утилиты и API-клиент
│   ├── package.json
│   └── next.config.mjs
├── docs/
│   ├── overview.md
│   ├── architecture.md
│   ├── api_reference.md
│   └── setup.md
└── README.md
```

## Документация

- [Обзор проекта](docs/overview.md)
- [Архитектура](docs/architecture.md)
- [Справочник API](docs/api_reference.md)
- [Инструкция по установке](docs/setup.md)

## Лицензия

MIT License.
