from pydantic import BaseModel

class LogEvent(BaseModel):
    call_id: str
    event_type: str
    payload: dict | None = None