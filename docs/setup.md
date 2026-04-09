# Инструкция по установке и запуску

## Системные требования
- Node.js v18 или выше (рекомендуется 64-битная версия).
- Python 3.10 или выше.
- Доступ к интернету для запросов к OpenAI API.

## Подготовка Backend (FastAPI)
1. Перейдите в папку бэкенда:
   ```bash
   cd backend
   ```
2. Создайте виртуальное окружение и активируйте его:
   ```bash
   python -m venv venv
   # Для Windows:
   .\venv\Scripts\Activate.ps1
   # Для Linux/macOS:
   source venv/bin/activate
   ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Настройте переменные окружения:
   - Переименуйте `.env.example` в `.env`.
   - Добавьте ваш `OPENAI_API_KEY`.

5. Запустите сервер:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Подготовка Frontend (Next.js)
1. Перейдите в папку фронтенда:
   ```bash
   cd frontend
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

## Использование
После запуска обоих серверов откройте [http://localhost:3000](http://localhost:3000). Используйте переключатель сценариев в верхней части страницы, чтобы изменить состояние города и увидеть реакцию AI и системы уведомлений.
