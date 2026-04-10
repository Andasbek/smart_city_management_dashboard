#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/.venv"

BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo
    echo "Останавливаю процессы..."
    if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    wait 2>/dev/null || true
    echo "Готово."
}
trap cleanup EXIT INT TERM

if [[ ! -d "$VENV_DIR" ]]; then
    echo "Виртуальное окружение не найдено, создаю в $VENV_DIR..."
    python3 -m venv "$VENV_DIR"
    "$VENV_DIR/bin/pip" install --upgrade pip
    "$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    echo "node_modules не найдены, выполняю npm install..."
    (cd "$FRONTEND_DIR" && npm install)
fi

echo "Запускаю backend на http://$BACKEND_HOST:$BACKEND_PORT ..."
(
    cd "$BACKEND_DIR"
    exec "$VENV_DIR/bin/uvicorn" app.main:app \
        --host "$BACKEND_HOST" \
        --port "$BACKEND_PORT" \
        --reload
) &
BACKEND_PID=$!

echo "Запускаю frontend на http://localhost:$FRONTEND_PORT ..."
(
    cd "$FRONTEND_DIR"
    exec npm run dev -- --port "$FRONTEND_PORT"
) &
FRONTEND_PID=$!

echo
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Нажмите Ctrl+C для остановки."
echo

wait -n "$BACKEND_PID" "$FRONTEND_PID"
