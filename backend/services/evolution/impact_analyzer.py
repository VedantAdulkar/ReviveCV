from backend.schemas.backend_schemas import CareerEvent, Branch
from backend.services.career_profile.event_context_builder import EventContextBuilder
# In a real implementation, this would call the AIClient (Qwen3)
# from backend.services.ai.ai_client import AIClient

class ImpactAnalyzer:
    @staticmethod
    def analyze_impact(branch: Branch, candidates: list[CareerEvent]) -> list[dict]:
        """
        Stage 2: Use Qwen3 to reason about the candidate events and return relevance facts.
        """
        if not candidates:
            return []
            
        context = EventContextBuilder.build_minimal_context(candidates)
        
        # STUB: Real implementation would prompt Qwen3 with `context` and `branch.configuration`
        # and ask it to output structured JSON of relevance and reasons.
        
        structured_facts = []
        for evt in candidates:
            structured_facts.append({
                "event_id": evt.event_id,
                "relevance": 0.95, # Mock score
                "reason": f"Matches branch configuration for {branch.name}."
            })
            
        return structured_facts
