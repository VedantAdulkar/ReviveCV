import json
from backend.schemas.backend_schemas import CareerEvent
from backend.services.storage.profile_storage import get_career_profile

class EventContextBuilder:
    @staticmethod
    def build_minimal_context(events: list[CareerEvent]) -> str:
        """
        Builds a minimal context representation of the events.
        Instead of sending the whole Career Profile to the AI, we only send
        the referenced objects based on the events.
        """
        profile = get_career_profile()
        if not profile:
            return "No Profile Context."

        context = []
        for event in events:
            # Stub logic for mapping events to profile objects
            # For MVP, we just include the event's raw payload
            context.append(f"Event: {event.event_id} ({event.event_type})")
            context.append(f"Target: {event.target}")
            context.append(f"Details: {json.dumps(event.payload, indent=2)}\n")

        return "\n".join(context)
