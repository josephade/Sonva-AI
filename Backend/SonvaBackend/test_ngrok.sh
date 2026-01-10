#!/bin/bash

NGROK_URL="https://opsonic-gaylord-sluggish.ngrok-free.app"

echo "🧪 Testing ngrok URL: $NGROK_URL"
echo ""

# Test 1: Health Check (GET /)
echo "1️⃣ Testing Health Check (GET /)..."
response=$(curl -s -w "\nHTTP Status: %{http_code}" "$NGROK_URL/" \
  -H "ngrok-skip-browser-warning: true")
echo "$response"
echo ""
echo "---"
echo ""

# Test 2: Get appointments by phone (GET /appointments/by_phone)
echo "2️⃣ Testing Get Appointments (GET /appointments/by_phone?phone=1234567890)..."
response=$(curl -s -w "\nHTTP Status: %{http_code}" \
  "$NGROK_URL/appointments/by_phone?phone=1234567890" \
  -H "ngrok-skip-browser-warning: true")
echo "$response"
echo ""
echo "---"
echo ""

# Test 3: Book appointment (POST /book)
echo "3️⃣ Testing Book Appointment (POST /book)..."
response=$(curl -s -w "\nHTTP Status: %{http_code}" \
  -X POST "$NGROK_URL/book" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "appointment_type": "checkup",
    "start": "2025-01-15T10:00:00",
    "patient_phone": "1234567890",
    "patient_name": "Test Patient"
  }')
echo "$response"
echo ""
echo "---"
echo ""

echo "✅ Test complete!"
echo ""
echo "💡 Tip: Visit $NGROK_URL/docs in your browser to see the interactive API documentation"
echo "💡 Note: Add header 'ngrok-skip-browser-warning: true' when making API calls"

