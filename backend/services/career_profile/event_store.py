import os
import json
import uuid
from datetime import datetime
from backend.schemas.backend_schemas import CareerEvent

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "../../../storage")
EVENTS_FILE = os.path.join(STORAGE_DIR, "career_events.json")

class EventStore:
    @staticmethod
    def get_events() -> list[CareerEvent]:
        if not os.path.exists(EVENTS_FILE):
            return []
        try:
            with open(EVENTS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return [CareerEvent(**e) for e in data]
        except Exception:
            return []

    @staticmethod
    def append_event(event_type: str, target: str, payload: dict, author: str = "user") -> CareerEvent:
        events = EventStore.get_events()
        
        event = CareerEvent(
            event_id=f"EVT-{uuid.uuid4().hex[:8]}",
            event_type=event_type,
            target=target,
            payload=payload,
            created_at=datetime.utcnow().isoformat() + "Z",
            author=author
        )
        
        events.append(event)
        
        os.makedirs(STORAGE_DIR, exist_ok=True)
        with open(EVENTS_FILE, "w", encoding="utf-8") as f:
            json.dump([e.model_dump() for e in events], f, indent=2)
            
        return event
