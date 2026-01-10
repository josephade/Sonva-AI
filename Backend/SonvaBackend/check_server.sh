#!/bin/bash

echo "🔍 Checking server status..."
echo ""

# Check if server is responding
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ 2>/dev/null)

if [ "$response" == "200" ]; then
    echo "✅ Server is running and responding!"
    echo ""
    echo "Testing health endpoint:"
    curl -s http://localhost:8000/
    echo ""
    echo ""
else
    echo "❌ Server is not responding (HTTP $response)"
    echo ""
    echo "Checking for processes on port 8000:"
    lsof -ti:8000 | while read pid; do
        echo "  - Process $pid is using port 8000"
        ps -p $pid -o command= 2>/dev/null || echo "    (Process may have crashed)"
    done
    echo ""
    echo "💡 Try restarting the server with: ./start_server.sh"
fi

