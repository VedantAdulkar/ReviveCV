import os
import json
from datetime import datetime
import re
from backend.schemas.backend_schemas import Session, SessionStatus, CareerProfile
from backend.services.storage.profile_storage import get_career_profile

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "../../../storage/sessions")

class SessionManager:
    @staticmethod
    def _slugify(text: str) -> str:
        text = text.lower()
        text = re.sub(r'[^a-z0-9]+', '_', text)
        return text.strip('_')

    @staticmethod
    def create_session(company: str, role: str, job_description: str) -> Session:
        profile = get_career_profile()
        if not profile:
            raise ValueError("No Career Profile found. Please import a resume first.")

        date_str = datetime.utcnow().strftime("%Y%m%d")
        role_slug = SessionManager._slugify(role)
        company_slug = SessionManager._slugify(company)
        session_id = f"session_{date_str}_{company_slug}_{role_slug}"

        session_dir = os.path.join(STORAGE_DIR, session_id)
        os.makedirs(session_dir, exist_ok=True)

        # Initialize the Session aggregate
        session = Session(
            session_id=session_id,
            company=company,
            role=role,
            status=SessionStatus.CREATED,
            career_profile_version=profile.metadata.version,
            career_profile_last_updated=profile.metadata.last_updated,
            job_description=job_description,
            created_at=datetime.utcnow().isoformat() + "Z",
            updated_at=datetime.utcnow().isoformat() + "Z"
        )

        # Persist initial files
        SessionManager.save_session(session)
        
        with open(os.path.join(session_dir, "job_description.txt"), "w", encoding="utf-8") as f:
            f.write(job_description)

        # Create empty placeholders for tracking (Optional, but follows best practices)
        for empty_file in ["analysis.json", "suggestions.json", "approved_suggestions.json", "resume_version.json", "cover_letter.json"]:
            with open(os.path.join(session_dir, empty_file), "w", encoding="utf-8") as f:
                json.dump({}, f)

        return session

    @staticmethod
    def save_session(session: Session) -> None:
        session.updated_at = datetime.utcnow().isoformat() + "Z"
        session_dir = os.path.join(STORAGE_DIR, session.session_id)
        os.makedirs(session_dir, exist_ok=True)
        
        with open(os.path.join(session_dir, "session.json"), "w", encoding="utf-8") as f:
            f.write(session.model_dump_json(indent=2))

    @staticmethod
    def get_session(session_id: str) -> Session | None:
        session_file = os.path.join(STORAGE_DIR, session_id, "session.json")
        if not os.path.exists(session_file):
            return None
            
        try:
            with open(session_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return Session(**data)
        except Exception as e:
            print(f"Error loading session {session_id}: {e}")
            return None
