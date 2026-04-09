# API Reference

Бэкенд предоставляет RESTful API на порту 8000.

## Dashboard
### `GET /api/dashboard/summary`
Возвращает общую сводку состояния города.
- **Ответ**: `CitySummary` (KPI, статусы транспорта и экологии, количество алертов).

## Транспорт
### `GET /api/transport/metrics`
Возвращает детальные метрики транспорта по районам.
- **Ответ**: Список `TransportMetric`.

## Экология
### `GET /api/ecology/metrics`
Возвращает детальные метрики экологии по районам.
- **Ответ**: Список `EcologyMetric`.

## Уведомления (Alerts)
### `GET /api/alerts/`
Возвращает список активных уведомлений.
- **Ответ**: Список `Alert`.

## Сценарии
### `POST /api/scenarios/{scenario_name}`
Переключает текущий сценарий данных бэкенда.
- **Параметры**: `normal`, `moderate`, `critical`.

## AI Аналитика
### `GET /api/ai-insights/`
Генерирует аналитический вывод и рекомендации на основе текущих данных.
- **Ответ**: `AIInsight` (summary, criticality, recommendations).
