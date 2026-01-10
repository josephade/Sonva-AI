#!/bin/bash

# Kill any process using port 8000
echo "Checking for processes on port 8000..."
PID=$(lsof -ti:8000)

if [ -z "$PID" ]; then
    echo "Port 8000 is free."
else
    echo "Killing process $PID on port 8000..."
    kill -9 $PID 2>/dev/null
    sleep 1
    
    # Verify it's killed
    if lsof -ti:8000 > /dev/null 2>&1; then
        echo "Warning: Could not kill process on port 8000"
        exit 1
    else
        echo "Port 8000 is now free."
    fi
fi

# Activate virtual environment if not already activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Activating virtual environment..."
    source ../venv/bin/activate
fi

# Start the server
echo "Starting FastAPI server on port 8000..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000

