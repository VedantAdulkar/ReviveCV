import pytest
from datetime import datetime, timezone
from pydantic import ValidationError
from app.domain.enums.career_event_type import CareerEventType
from app.domain.models.career_event import CareerEvent

def test_career_event_immutability():
    """Verify that attempting to modify a CareerEvent after creation raises an error."""
    
    event = CareerEvent(
        event_type=CareerEventType.SKILL_ADDED,
        occurred_at=datetime(2026, 7, 24, tzinfo=timezone.utc),
        payload={"skill": "Python"}
    )
    
    # Event should be created successfully
    assert event.event_type == CareerEventType.SKILL_ADDED
    assert event.schema_version == "1.0"
    
    # Attempting to mutate a field should raise an error
    with pytest.raises(ValidationError):
        event.schema_version = "2.0"
        
    with pytest.raises(ValidationError):
        event.event_type = CareerEventType.SKILL_REMOVED
        
    with pytest.raises(ValidationError):
        event.payload = {"skill": "Java"}

def test_career_event_defaults():
    """Verify that defaults like event_id and recorded_at are generated automatically."""
    
    event = CareerEvent(
        event_type=CareerEventType.PROJECT_ADDED,
        occurred_at=datetime(2026, 7, 24, tzinfo=timezone.utc),
        payload={"project_name": "ReviveCV"}
    )
    
    assert event.event_id is not None
    assert event.recorded_at is not None
    assert event.recorded_at >= event.occurred_at
