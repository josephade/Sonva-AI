from fastapi import FastAPI
from routers.booking import router as booking_router
from routers.dashboard import router as dashboard_router
from routers.telnyx import router as telnyx_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok", "service": "Sonva AI backend running"}

# Register routers
app.include_router(booking_router, prefix="/booking", tags=["Booking"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(telnyx_router, prefix="/telnyx", tags=["Telnyx"])
