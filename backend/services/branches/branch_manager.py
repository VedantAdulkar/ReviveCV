import os
import json
import uuid
import re
from datetime import datetime
from backend.schemas.backend_schemas import Branch, BranchConfiguration
from backend.services.storage.profile_storage import get_career_profile

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "../../../storage/branches")

class BranchManager:
    @staticmethod
    def _slugify(text: str) -> str:
        text = text.lower()
        text = re.sub(r'[^a-z0-9]+', '_', text)
        return text.strip('_')

    @staticmethod
    def create_branch(name: str, purpose: str, configuration: dict = None) -> Branch:
        profile = get_career_profile()
        if not profile:
            raise ValueError("No Career Profile found. Please import a resume first.")

        branch_slug = BranchManager._slugify(name)
        branch_id = f"branch_{branch_slug}_{uuid.uuid4().hex[:6]}"
        
        branch_dir = os.path.join(STORAGE_DIR, branch_id)
        os.makedirs(branch_dir, exist_ok=True)
        os.makedirs(os.path.join(branch_dir, "current"), exist_ok=True)
        os.makedirs(os.path.join(branch_dir, "versions"), exist_ok=True)
        os.makedirs(os.path.join(branch_dir, "sessions"), exist_ok=True)

        config_obj = BranchConfiguration(**configuration) if configuration else BranchConfiguration()

        branch = Branch(
            branch_id=branch_id,
            name=name,
            purpose=purpose,
            status="synced",
            based_on_profile_version=profile.metadata.version,
            configuration=config_obj,
            created_at=datetime.utcnow().isoformat() + "Z",
            updated_at=datetime.utcnow().isoformat() + "Z"
        )

        BranchManager.save_branch(branch)
        return branch

    @staticmethod
    def save_branch(branch: Branch) -> None:
        branch.updated_at = datetime.utcnow().isoformat() + "Z"
        branch_dir = os.path.join(STORAGE_DIR, branch.branch_id)
        os.makedirs(branch_dir, exist_ok=True)
        
        with open(os.path.join(branch_dir, "branch.json"), "w", encoding="utf-8") as f:
            f.write(branch.model_dump_json(indent=2))

    @staticmethod
    def get_branch(branch_id: str) -> Branch | None:
        branch_file = os.path.join(STORAGE_DIR, branch_id, "branch.json")
        if not os.path.exists(branch_file):
            return None
            
        try:
            with open(branch_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return Branch(**data)
        except Exception as e:
            print(f"Error loading branch {branch_id}: {e}")
            return None

    @staticmethod
    def list_branches() -> list[Branch]:
        if not os.path.exists(STORAGE_DIR):
            return []
        
        branches = []
        for d in os.listdir(STORAGE_DIR):
            branch = BranchManager.get_branch(d)
            if branch:
                branches.append(branch)
        return branches

    @staticmethod
    def promote_version(branch_id: str, version_id: str) -> Branch:
        branch = BranchManager.get_branch(branch_id)
        if not branch:
            raise ValueError(f"Branch {branch_id} not found.")
            
        if version_id not in branch.versions:
            raise ValueError(f"Version {version_id} not found in branch {branch_id}.")
            
        # In a full implementation, this would copy actual PDF/DOCX files from versions/{version_id}/
        # to the current/ directory. For now, we update the metadata to point to current/.
        
        branch.current_resume_version_id = version_id
        
        # Simulating file promotion by pointing to the managed current directory
        branch.current_artifacts.resume_docx = "current/resume.docx"
        branch.current_artifacts.resume_pdf = "current/resume.pdf"
        branch.current_artifacts.cover_letter_docx = "current/cover_letter.docx"
        branch.current_artifacts.cover_letter_pdf = "current/cover_letter.pdf"
        
        BranchManager.save_branch(branch)
        return branch
