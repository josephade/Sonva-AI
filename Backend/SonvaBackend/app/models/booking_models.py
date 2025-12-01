from pydantic import BaseModel
from datetime import datetime

class BookRequest(BaseModel):
    appointment_type: str
    start: datetime
    patient_phone: str
    patient_name: str | None = None

class CancelRequest(BaseModel):
    event_id: str

class RescheduleRequest(BaseModel):
    event_id: str
    new_start: datetime
