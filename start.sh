#!/bin/bash

echo "Starting CredX Services..."

# Function to kill process on a port
kill_port() {
  local port=$1
  local pid=$(lsof -t -i:$port)
  if [ ! -z "$pid" ]; then
    echo "Port $port is in use by PID $pid, killing it..."
    kill -9 $pid 2>/dev/null || true
  fi
}

echo "Checking for existing processes on ports 3000 and 5001..."
kill_port 3000
kill_port 5001

echo "Copying environment variables to frontend..."
cp .env frontend/.env.local

echo "Starting Backend API (Port 5001)..."
cd backend
npm run dev &
cd ..

echo "Starting Frontend App (Port 3000)..."
cd frontend
npm run dev &
cd ..

echo "=========================================="
echo "✅ CredX Services Started!"
echo "📡 Frontend: http://localhost:3000"
echo "⚙️  Backend:  http://localhost:5001"
echo "=========================================="
echo "Press Ctrl+C in this terminal to stop them if needed, or run ./stop.sh"

wait
