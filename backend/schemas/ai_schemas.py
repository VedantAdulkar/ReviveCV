from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

# --- 1. JD & Gap Analysis ---

class ScoreBreakdown(BaseModel):
    skills: int
    projects: int
    experience: int
    keywords: int

class AIScore(BaseModel):
    total: int
    breakdown: ScoreBreakdown

class AnalysisDetails(BaseModel):
    matching_skills: List[str]
    missing_keywords: List[str]
    highly_relevant_projects: List[str]
    highly_relevant_experience: List[str]

class AnalysisResponse(BaseModel):
    """Generated after comparing the Career Profile against the JD."""
    ai_score: AIScore
    analysis: AnalysisDetails

# --- 2. Atomic Suggestions ---

class SuggestionAction(str, Enum):
    REWRITE = "rewrite"
    REORDER = "reorder"
    HIGHLIGHT = "highlight"
    HIDE = "hide"
    MOVE = "move"
    REPLACE = "replace"

class SuggestionCategory(str, Enum):
    SUMMARY = "Summary"
    EXPERIENCE = "Experience"
    PROJECTS = "Projects"
    SKILLS = "Skills"
    EDUCATION = "Education"

class SuggestionPriority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class AIFact(BaseModel):
    missing_keyword: Optional[str] = None
    reason: str
    affected_section: SuggestionCategory
    recommendation: str

class AIFactsResponse(BaseModel):
    """The AI returns structured facts and recommendations, not backend suggestion objects."""
    facts: List[AIFact]

# --- 3. Cover Letter Generation ---

class CoverLetterDetails(BaseModel):
    recipient_name: str
    company_name: str
    date: str
    opening: str
    body: List[str]
    closing: str

class CoverLetterResponse(BaseModel):
    """Generates the cover letter based ONLY on the generated Resume Version object."""
    cover_letter: CoverLetterDetails
