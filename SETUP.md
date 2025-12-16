# Sonva AI - Setup & Run Guide

## Prerequisites

- Node.js and npm installed
- Python 3.9+ installed
- Environment variables configured (see below)

## Environment Variables

### Backend (.env file in `Backend/SonvaBackend/`)

Create a `.env` file with:

```env
# Google Calendar API Configuration
GOOGLE_CLIENT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Server Port (defaults to 8000)
PORT=8000
```

### Frontend (.env.local file in `Frontend/frontend/`)

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-project-id
```

## Running the Application

### Option 1: Run Both Services Separately

#### Backend (FastAPI)
```bash
cd Backend/SonvaBackend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or use the start script:
```bash
cd Backend/SonvaBackend
chmod +x start.sh
./start.sh
```

The backend will run on: http://localhost:8000

#### Frontend (Next.js)
```bash
cd Frontend/frontend
npm run dev
```

The frontend will run on: http://localhost:3000

### Option 2: Run Both in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd /Users/destinyjames/Desktop/Projects/Sonva-AI/Backend/SonvaBackend
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd /Users/destinyjames/Desktop/Projects/Sonva-AI/Frontend/frontend
npm run dev
```

## API Endpoints

Once the backend is running, you can access:

- Health check: http://localhost:8000/
- Book appointment: POST http://localhost:8000/book
- Cancel appointment: POST http://localhost:8000/cancel
- Reschedule appointment: POST http://localhost:8000/reschedule
- Get appointments by phone: GET http://localhost:8000/appointments/by_phone?phone=+1234567890

## Troubleshooting

1. **Backend won't start**: Make sure all environment variables are set in `.env`
2. **Frontend can't connect to backend**: Check CORS settings and ensure backend is running
3. **Python dependencies**: If uvicorn is not found, make sure it's installed: `pip3 install -r requirements.txt`
4. **Node modules**: If frontend errors occur, try: `cd Frontend/frontend && npm install`

