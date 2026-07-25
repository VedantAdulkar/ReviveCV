from datetime import datetime, timezone
from uuid import UUID, uuid4
from typing import Any, Dict
from pydantic import BaseModel, ConfigDict, Field
from app.domain.enums.career_event_type import CareerEventType

class CareerEvent(BaseModel):
    """
    Immutable fact describing a professional evolution event.
    """
    model_config = ConfigDict(frozen=True)

    event_id: UUID = Field(default_factory=uuid4)
    event_type: CareerEventType
    occurred_at: datetime
    recorded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    schema_version: str = Field(default="1.0", frozen=True)
    
    # TODO: In future iterations, replace Dict[str, Any] with typed payload Value Objects (e.g., SkillAddedPayload)
    payload: Dict[str, Any]
