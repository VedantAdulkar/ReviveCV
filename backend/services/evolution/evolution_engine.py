from backend.schemas.backend_schemas import Branch, Session
from backend.services.career_profile.change_detector import ChangeDetector
from backend.services.evolution.pre_filter import PreFilter
from backend.services.evolution.impact_analyzer import ImpactAnalyzer
from backend.services.evolution.merge_planner import MergePlanner

class EvolutionEngine:
    @staticmethod
    def sync_branch(branch: Branch) -> Session | None:
        """
        Orchestrates the 3-Stage Evolution Engine for a specific branch.
        """
        
        # 1. Get missing events
        missing_events = ChangeDetector.get_missing_events(branch)
        if not missing_events:
            return None
            
        # Stage 1: Deterministic Filter
        candidate_events = PreFilter.filter_events(branch, missing_events)
        if not candidate_events:
            # All events filtered out, just bump version
            branch.based_on_profile_version += len(missing_events)
            # In real system, we'd save branch here.
            return None
            
        # Stage 2: Qwen3 Impact Analysis
        relevance_facts = ImpactAnalyzer.analyze_impact(branch, candidate_events)
        
        # Stage 3: Merge Planner
        session = MergePlanner.create_sync_session(branch, relevance_facts)
        
        return session
