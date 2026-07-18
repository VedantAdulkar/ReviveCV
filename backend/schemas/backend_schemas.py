from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum

# --- Shared Models ---

class Location(BaseModel):
    city: str
    state: str
    country: str

class Urls(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

class Contact(BaseModel):
    full_name: str
    headline: str
    email: str
    phone: str
    location: Location
    urls: Urls

class Profile(BaseModel):
    summary: str

class Experience(BaseModel):
    id: str
    company: str
    title: str
    start_date: str  # YYYY-MM
    end_date: str  # YYYY-MM or "Present"
    is_current: bool
    responsibilities: List[str]
    tech_stack: List[str]

class Project(BaseModel):
    id: str
    name: str
    domain: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None

class Skills(BaseModel):
    languages: List[str]
    frameworks: List[str]
    tools: List[str]

class Education(BaseModel):
    id: str
    degree: str
    institute: str
    start_year: str
    end_year: str
    gpa: str

class Metadata(BaseModel):
    schema_version: str = "1.0"
    last_updated: str
    version: int

# --- 1. Career Profile ---

class CareerProfile(BaseModel):
    """Immutable source of truth."""
    contact: Contact
    profile: Profile
    experience: List[Experience]
    projects: List[Project]
    skills: Skills
    education: List[Education]
    metadata: Metadata

# --- 2. Resume Version ---

class ResumeContent(BaseModel):
    contact: Contact
    summary: str
    experience: List[Experience]
    projects: List[Project]
    skills: Skills
    education: List[Education]

class ResumeVersion(BaseModel):
    version_id: str
    parent_version: Optional[str] = None
    branch_id: str
    generated_by: GeneratedBy
    career_profile_events: List[str] = Field(default_factory=list)
    content: Dict[str, Any]
    created_at: str

# --- 3. Session ---

class SessionStatus(str, Enum):
    CREATED = "created"
    JD_PARSED = "jd_parsed"
    ANALYZING = "analyzing"
    ANALYSIS_COMPLETED = "analysis_completed"
    SUGGESTIONS_GENERATED = "suggestions_generated"
    REVIEWING = "reviewing"
    SUGGESTIONS_APPLIED = "suggestions_applied"
    RESUME_GENERATED = "resume_generated"
    COVER_LETTER_GENERATED = "cover_letter_generated"
    COMPLETED = "completed"

class SessionType(str, Enum):
    JOB_OPTIMIZATION = "JOB_OPTIMIZATION"
    PROFILE_SYNC = "PROFILE_SYNC"

class GeneratedBy(BaseModel):
    type: SessionType
    session_id: str

class CareerEvent(BaseModel):
    event_id: str
    event_type: str
    target: str
    payload: Dict[str, Any]
    created_at: str
    author: str = "user"

class AnalysisResult(BaseModel):
    ai_score: Dict[str, Any]
    matching_skills: List[str]
    missing_keywords: List[str]
    highly_relevant_projects: List[str]
    highly_relevant_experience: List[str]
    prompt_version: str
    model: str
    generated_at: str

class SuggestionStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    APPLIED = "applied"
    ARCHIVED = "archived"

class Suggestion(BaseModel):
    id: str
    target_id: str
    target_type: str
    action: str
    priority: str
    category: str
    reason: str
    current_value: Optional[str] = None
    suggested_value: Optional[str] = None
    confidence: float
    status: SuggestionStatus = SuggestionStatus.PENDING
    created_at: str

class Session(BaseModel):
    """Single source of state for the optimization run or sync."""
    session_id: str
    session_type: SessionType = SessionType.JOB_OPTIMIZATION
    company: Optional[str] = None
    role: Optional[str] = None
    status: SessionStatus = SessionStatus.CREATED
    career_profile_version: int
    career_profile_event_range: List[str] = Field(default_factory=list)
    branch_version: Optional[str] = None
    prompt_version: str = "1.0"
    model: str = "qwen3:8b"
    job_description: Optional[str] = None
    analysis: Optional[AnalysisResult] = None
    suggestions: List[Suggestion] = Field(default_factory=list)
    approved_suggestions: List[str] = Field(default_factory=list)
    resume_version: Optional[ResumeVersion] = None
    cover_letter: Dict[str, Any] = Field(default_factory=dict)
    created_at: str
    updated_at: str

class BranchConfiguration(BaseModel):
    focus_keywords: List[str] = Field(default_factory=list)
    preferred_projects: List[str] = Field(default_factory=list)
    preferred_experience: List[str] = Field(default_factory=list)
    hidden_sections: List[str] = Field(default_factory=list)

class BranchArtifacts(BaseModel):
    resume_docx: Optional[str] = None
    resume_pdf: Optional[str] = None
    cover_letter_docx: Optional[str] = None
    cover_letter_pdf: Optional[str] = None

class Branch(BaseModel):
    branch_id: str
    name: str
    purpose: str
    status: str = "synced"
    based_on_profile_version: int
    current_resume_version_id: Optional[str] = None
    current_artifacts: BranchArtifacts = Field(default_factory=BranchArtifacts)
    configuration: BranchConfiguration = Field(default_factory=BranchConfiguration)
    sessions: List[str] = Field(default_factory=list)
    versions: List[str] = Field(default_factory=list)
    created_at: str
    updated_at: str
