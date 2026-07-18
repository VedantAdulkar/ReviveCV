from backend.schemas.backend_schemas import CareerEvent, Branch

class PreFilter:
    @staticmethod
    def filter_events(branch: Branch, events: list[CareerEvent]) -> list[CareerEvent]:
        """
        Stage 1: Deterministic filter to eliminate obviously irrelevant events.
        """
        config = branch.configuration
        candidates = []
        
        # Simple heuristic stub:
        # Check if event payload has overlap with hidden_sections or if it strictly misses focus.
        # For this MVP, we return all events unless they mention a hidden section.
        for event in events:
            payload_str = str(event.payload).lower()
            hidden = False
            for sec in config.hidden_sections:
                if sec.lower() in payload_str:
                    hidden = True
                    break
            
            if not hidden:
                candidates.append(event)
                
        return candidates
