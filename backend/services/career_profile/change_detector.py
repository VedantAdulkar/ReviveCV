from backend.services.career_profile.event_store import EventStore
from backend.services.branches.branch_manager import BranchManager
from backend.schemas.backend_schemas import CareerEvent, Branch

class ChangeDetector:
    @staticmethod
    def get_missing_events(branch: Branch) -> list[CareerEvent]:
        """
        Returns all events in the Career Profile that occurred AFTER the branch's base profile version.
        Since we bump the profile version count with the number of events, we can use slicing.
        """
        all_events = EventStore.get_events()
        # If branch is based on version 14, and we have 16 events, it missed event 15 and 16.
        # i.e., events[14:] 
        base_version = branch.based_on_profile_version
        if base_version < len(all_events):
            return all_events[base_version:]
        return []

    @staticmethod
    def identify_affected_branches() -> list[dict]:
        """
        Scans all branches and returns those that are behind Main.
        """
        affected = []
        all_branches = BranchManager.list_branches()
        
        for branch in all_branches:
            missing_events = ChangeDetector.get_missing_events(branch)
            if missing_events:
                affected.append({
                    "branch": branch,
                    "missing_events": missing_events
                })
        
        return affected
