from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict

class CareerProfile(BaseModel):
    """
    Materialized read-only snapshot representing the complete state of a professional profile.
    This is not a mutating aggregate, but a deterministically generated projection.
    """
    model_config = ConfigDict(frozen=True)

    summary: Optional[str] = None
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    skills: List[str] = []
    education: List[Dict[str, Any]] = []
    certifications: List[Dict[str, Any]] = []
