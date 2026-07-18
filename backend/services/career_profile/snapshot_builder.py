from backend.services.career_profile.event_store import EventStore
from backend.services.storage.profile_storage import get_career_profile, save_career_profile
from backend.schemas.backend_schemas import CareerProfile, Metadata

class SnapshotBuilder:
    @staticmethod
    def rebuild_snapshot() -> CareerProfile:
        """
        Rebuilds the CareerProfile snapshot from the event log.
        In a robust system, this applies events chronologically.
        For Phase 3.4, we stub the event application logic.
        """
        events = EventStore.get_events()
        
        # Load the base profile (if we had a base) or build from scratch.
        # For this MVP, we assume the initial import created a snapshot, 
        # and new events just patch the existing snapshot.
        profile = get_career_profile()
        if not profile:
            # If no profile exists, create a blank one
            profile = CareerProfile(
                contact={},
                profile={"summary": ""},
                experience=[],
                projects=[],
                skills={},
                education=[],
                metadata=Metadata(schema_version="1.0", version=0)
            )

        # In a real event-sourced system, we would apply `events` since `profile.metadata.version`
        # e.g., if event is "PROJECT_ADDED", we append it to profile.projects.
        
        # We bump the version to represent the new snapshot
        profile.metadata.version = len(events)
        
        # Persist the snapshot
        save_career_profile(profile)
        
        return profile
