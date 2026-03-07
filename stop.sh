#!/bin/bash

echo "Stopping CredX Services..."

# Function to kill process on a port
kill_port() {
  local port=$1
  local pid=$(lsof -t -i:$port)
  if [ ! -z "$pid" ]; then
    echo "Killing process $pid on port $port..."
    kill -9 $pid 2>/dev/null || true
  else
    echo "Port $port is already free."
  fi
}

kill_port 3000
kill_port 5001

echo "Cleaning up stray node background tasks..."
# Just an extra safeguard, though ports handle most of it
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "nodemon src/app.js" 2>/dev/null || true

echo "✅ All CredX services stopped successfully."
