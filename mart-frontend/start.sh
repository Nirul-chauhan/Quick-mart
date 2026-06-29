#!/bin/bash
echo "============================================"
echo "  Blinkit - Starting Backend + Frontend"
echo "============================================"

# Go to the folder where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "[1/2] Starting FastAPI backend on port 9000..."
cd "$SCRIPT_DIR/blinkit_backend"
uvicorn app.main:app --reload --port 9000 &
BACKEND_PID=$!

sleep 2

echo "[2/2] Starting React frontend on port 3000..."
cd "$SCRIPT_DIR/blinkit-frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers running:"
echo "  Backend:  http://localhost:9000/docs"
echo "  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both."

# Stop both on Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
