from backend.schemas.backend_schemas import Branch, Session, SessionType, SessionEvolutionMetadata
from backend.services.sessions.session_manager import SessionManager
from backend.services.branches.branch_manager import BranchManager

class MergePlanner:
    @staticmethod
    def create_sync_session(branch: Branch, relevance_facts: list[dict]) -> Session:
        """
        Stage 3: Deterministic Session Creation.
        Takes relevance facts and sets up the exact same pipeline used by Job Optimization.
        """
        relevant_event_ids = [f["event_id"] for f in relevance_facts if f["relevance"] > 0.5]
        
        if not relevant_event_ids:
            # If nothing is relevant, we might just bump the branch's based_on_version without a new ResumeVersion.
            pass
            
        session = SessionManager.create_session(
            company="Profile Evolution",
            role=branch.name,
            job_description="Syncing new Career Profile events to Resume Branch."
        )
        
        session.session_type = SessionType.PROFILE_SYNC
        session.career_profile_event_range = relevant_event_ids
        session.branch_version = branch.current_resume_version_id
        
        session.evolution = SessionEvolutionMetadata(
            trigger="CAREER_PROFILE_UPDATED",
            missing_events=relevant_event_ids,
            affected_branch=branch.branch_id
        )
        
        branch.sessions.append(session.session_id)
        BranchManager.save_branch(branch)
        SessionManager.save_session(session)
        
        return session
