import uvicorn
import os
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas.backend_schemas import CareerProfile
from backend.services.importer.docx_importer import DOCXImporter
from backend.services.storage.profile_storage import save_career_profile, get_career_profile

app = FastAPI(
    title="ReviveCV API",
    description="AI-Powered Resume Optimizer",
    version="1.0.0"
)

# CORS setup for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ReviveCV API is running"}

# --- 1. Career Profile Endpoints ---

@app.post("/career-profile/import")
async def import_career_profile(file: UploadFile = File(...)):
    if not file.filename.endswith('.docx'):
        raise HTTPException(status_code=400, detail="Only DOCX format is currently supported.")
    
    # Save uploaded file to a temporary location
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name
            
        importer = DOCXImporter()
        profile, confidence = importer.import_resume(temp_path)
        
        # Persist it
        if not save_career_profile(profile):
            raise HTTPException(status_code=500, detail="Failed to persist Career Profile.")
            
        return {
            "message": "Resume imported successfully.",
            "confidence_scores": confidence,
            "profile": profile.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/career-profile", response_model=CareerProfile)
def read_career_profile():
    profile = get_career_profile()
    if not profile:
        raise HTTPException(status_code=404, detail="Career Profile not found.")
    return profile

@app.put("/career-profile")
def update_career_profile(profile: CareerProfile):
    if save_career_profile(profile):
        return {"message": "Career Profile updated successfully."}
    raise HTTPException(status_code=500, detail="Failed to update Career Profile.")

# --- 2. Session & AI Endpoints ---

from pydantic import BaseModel
from backend.services.sessions.session_manager import SessionManager
from backend.services.branches.branch_manager import BranchManager
from backend.schemas.backend_schemas import Branch

class BranchCreateRequest(BaseModel):
    name: str
    purpose: str
    configuration: dict = {}

@app.post("/branches", response_model=Branch)
def create_branch(request: BranchCreateRequest):
    try:
        branch = BranchManager.create_branch(
            name=request.name,
            purpose=request.purpose,
            configuration=request.configuration
        )
        return branch
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/branches", response_model=list[Branch])
def list_branches():
    return BranchManager.list_branches()

@app.get("/branches/{branch_id}", response_model=Branch)
def get_branch(branch_id: str):
    branch = BranchManager.get_branch(branch_id)
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found.")
    return branch

class SessionCreateRequest(BaseModel):
    job_description: str

@app.post("/branches/{branch_id}/sessions", response_model=Session)
def create_session(branch_id: str, request: SessionCreateRequest):
    branch = BranchManager.get_branch(branch_id)
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found.")
        
    try:
        session = SessionManager.create_session(
            company="Unknown", # Will be inferred or passed
            role=branch.name,
            job_description=request.job_description
        )
        branch.sessions.append(session.session_id)
        BranchManager.save_branch(branch)
        return session
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/branches/{branch_id}/sessions/{session_id}", response_model=Session)
def get_session(branch_id: str, session_id: str):
    session = SessionManager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session

from backend.services.ai.pipeline import AIPipeline
from backend.schemas.backend_schemas import AnalysisResult, SessionStatus
from datetime import datetime

@app.post("/branches/{branch_id}/sessions/{session_id}/analyze", response_model=Session)
def run_analysis(branch_id: str, session_id: str):
    session = SessionManager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    profile = get_career_profile()
    if not profile:
        raise HTTPException(status_code=400, detail="Career profile is missing.")

    session.status = SessionStatus.ANALYZING
    SessionManager.save_session(session)

    pipeline = AIPipeline()
    variables = {
        "job_description": session.job_description,
        "career_profile": profile.model_dump()
    }
    
    try:
        analysis_result = pipeline.run("analysis", variables, AnalysisResult, session.session_id)
        if not analysis_result:
            raise ValueError("Pipeline returned None.")
            
        analysis_result.generated_at = datetime.utcnow().isoformat() + "Z"
        session.analysis = analysis_result
        session.status = SessionStatus.ANALYSIS_COMPLETED
        SessionManager.save_session(session)
        
        return session
    except Exception as e:
        session.status = SessionStatus.CREATED # Revert status
        SessionManager.save_session(session)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

from backend.services.ai.suggestion_pipeline import SuggestionPipeline

@app.post("/branches/{branch_id}/sessions/{session_id}/suggestions", response_model=Session)
def generate_suggestions(branch_id: str, session_id: str):
    session = SessionManager.get_session(session_id)
    if not session or not session.analysis:
        raise HTTPException(status_code=400, detail="Session not found or analysis missing.")
    
    profile = get_career_profile()
    if not profile:
        raise HTTPException(status_code=400, detail="Career profile is missing.")

    pipeline = SuggestionPipeline()
    try:
        suggestions = pipeline.generate_suggestions(
            session_id=session.session_id,
            job_description=session.job_description,
            career_profile=profile.model_dump(),
            analysis=session.analysis.model_dump()
        )
        session.suggestions = suggestions
        session.status = SessionStatus.SUGGESTIONS_GENERATED
        SessionManager.save_session(session)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/branches/{branch_id}/sessions/{session_id}/suggestions")
def get_suggestions(branch_id: str, session_id: str):
    session = SessionManager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"suggestions": [s.model_dump() for s in session.suggestions]}

class SuggestionUpdateRequest(BaseModel):
    status: SessionStatus # Re-using enum or explicitly string. Let's use string to avoid conflict
    # Actually wait, we should use SuggestionStatus
    pass

from backend.schemas.backend_schemas import SuggestionStatus as SugStatus

class SugUpdateRequest(BaseModel):
    status: SugStatus

@app.patch("/branches/{branch_id}/sessions/{session_id}/suggestions/{suggestion_id}")
def update_suggestion(branch_id: str, session_id: str, suggestion_id: str, request: SugUpdateRequest):
    session = SessionManager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    for sug in session.suggestions:
        if sug.id == suggestion_id:
            sug.status = request.status
            SessionManager.save_session(session)
            return {"message": "Suggestion updated", "suggestion": sug.model_dump()}
            
    raise HTTPException(status_code=404, detail="Suggestion not found.")

@app.post("/branches/{branch_id}/sessions/{session_id}/approve")
def approve_suggestions(branch_id: str, session_id: str):
    session = SessionManager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    approved = [s.id for s in session.suggestions if s.status == SugStatus.ACCEPTED]
    session.approved_suggestions = approved
    session.status = SessionStatus.REVIEWING
    SessionManager.save_session(session)
    return {"message": "Approved suggestions saved.", "approved_count": len(approved)}

@app.post("/branches/{branch_id}/sessions/{session_id}/generate")
def generate_artifacts(branch_id: str, session_id: str):
    # TODO: Generate PDF/DOCX and Cover Letter based on approved suggestions
    return {"message": "Not implemented yet", "session_id": session_id}

@app.post("/branches/{branch_id}/versions/{version_id}/promote", response_model=Branch)
def promote_version(branch_id: str, version_id: str):
    try:
        branch = BranchManager.promote_version(branch_id, version_id)
        return branch
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
