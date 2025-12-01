from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.booking import router as booking_router
from app.routers.dashboard import router as dashboard_router
from app.routers.telnyx import router as telnyx_router

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"],
)

@app.get("/")
def health():
    return {"status": "ok", "service": "Sonva AI backend running"}

# Register routers
app.include_router(booking_router, prefix="/booking", tags=["Booking"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(telnyx_router, prefix="/telnyx", tags=["Telnyx"])
