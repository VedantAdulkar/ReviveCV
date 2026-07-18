import json
import os
from backend.schemas.backend_schemas import CareerProfile

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "../../../storage")
PROFILE_FILE = os.path.join(STORAGE_DIR, "career_profile.json")

def save_career_profile(profile: CareerProfile) -> bool:
    """Persists the CareerProfile to local storage."""
    os.makedirs(STORAGE_DIR, exist_ok=True)
    try:
        with open(PROFILE_FILE, "w", encoding="utf-8") as f:
            f.write(profile.model_dump_json(indent=2))
        return True
    except Exception as e:
        print(f"Error saving career profile: {e}")
        return False

def get_career_profile() -> CareerProfile | None:
    """Retrieves the CareerProfile from local storage."""
    if not os.path.exists(PROFILE_FILE):
        return None
    try:
        with open(PROFILE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return CareerProfile(**data)
    except Exception as e:
        print(f"Error loading career profile: {e}")
        return None
