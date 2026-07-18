import uuid
from datetime import datetime
from backend.services.ai.pipeline import AIPipeline
from backend.schemas.ai_schemas import AIFactsResponse
from backend.schemas.backend_schemas import Suggestion, SuggestionStatus

class SuggestionPipeline:
    def __init__(self):
        self.pipeline = AIPipeline()

    def generate_suggestions(self, session_id: str, job_description: str, career_profile: dict, analysis: dict) -> list[Suggestion]:
        variables = {
            "job_description": job_description,
            "career_profile": career_profile,
            "analysis": analysis
        }
        
        # 1. Pipeline A: AI generates raw facts
        facts_response = self.pipeline.run("suggestions", variables, AIFactsResponse, session_id)
        if not facts_response:
            raise ValueError("AI Pipeline failed to generate facts.")
            
        suggestions = []
        
        # 2. Pipeline A: Backend maps facts to Suggestion domain objects
        for fact in facts_response.facts:
            s_id = f"sug_{uuid.uuid4().hex[:8]}"
            
            # Simple heuristic mapping for MVP
            action = "highlight" if "highlight" in fact.recommendation.lower() else "add"
            priority = "high" if fact.missing_keyword else "medium"
            
            sug = Suggestion(
                id=s_id,
                target_id=f"profile.{fact.affected_section.lower()}",
                target_type="text",
                action=action,
                priority=priority,
                category=fact.affected_section,
                reason=fact.reason,
                current_value=None, # To be determined by diff UI or applier
                suggested_value=fact.recommendation,
                confidence=0.85, # Base confidence
                status=SuggestionStatus.PENDING,
                created_at=datetime.utcnow().isoformat() + "Z"
            )
            suggestions.append(sug)
            
        return suggestions
