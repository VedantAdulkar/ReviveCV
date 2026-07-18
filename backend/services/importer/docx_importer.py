import docx
from typing import Tuple, Dict, Any, List
from backend.services.importer.base import BaseImporter
from backend.schemas.backend_schemas import (
    CareerProfile, Contact, Profile, Experience, Project, Skills, Education, Metadata, Location, Urls
)
from datetime import datetime
import re

class DOCXImporter(BaseImporter):
    def import_resume(self, file_path: str) -> Tuple[CareerProfile, Dict[str, float]]:
        doc = docx.Document(file_path)
        text_blocks = [para.text.strip() for para in doc.paragraphs if para.text.strip()]

        # Deterministic Parsing Heuristics
        sections = {
            "summary": [],
            "experience": [],
            "projects": [],
            "skills": [],
            "education": []
        }
        
        current_section = None
        
        # Simple heading detection
        for block in text_blocks:
            lower_block = block.lower()
            if lower_block in ["summary", "profile", "about me", "professional summary"]:
                current_section = "summary"
                continue
            elif lower_block in ["experience", "work experience", "employment history"]:
                current_section = "experience"
                continue
            elif lower_block in ["projects", "personal projects", "academic projects"]:
                current_section = "projects"
                continue
            elif lower_block in ["skills", "technical skills", "core competencies"]:
                current_section = "skills"
                continue
            elif lower_block in ["education", "academic background"]:
                current_section = "education"
                continue
            
            if current_section:
                sections[current_section].append(block)

        # 1. Contact (Heuristic: first block is name, look for @ for email)
        name = text_blocks[0] if text_blocks else "Unknown Name"
        email = next((b for b in text_blocks[:10] if "@" in b), "unknown@example.com")
        
        contact = Contact(
            full_name=name,
            headline="Software Engineer",  # Fallback
            email=email,
            phone="+1234567890",
            location=Location(city="Unknown", state="Unknown", country="Unknown"),
            urls=Urls()
        )

        # 2. Profile
        summary_text = " ".join(sections["summary"]) if sections["summary"] else ""
        profile = Profile(summary=summary_text)

        # 3. Experience (Naive splitting by blocks)
        experience = []
        if sections["experience"]:
            experience.append(
                Experience(
                    id="exp_001",
                    company="Parsed Company",
                    title="Parsed Role",
                    start_date="Unknown",
                    end_date="Unknown",
                    is_current=False,
                    responsibilities=sections["experience"],
                    tech_stack=[]
                )
            )

        # 4. Projects
        projects = []
        if sections["projects"]:
            projects.append(
                Project(
                    id="proj_001",
                    name="Parsed Project",
                    domain="Unknown",
                    description=" ".join(sections["projects"]),
                    technologies=[]
                )
            )
        
        # 5. Skills
        skills = Skills(
            languages=sections["skills"] if sections["skills"] else [],
            frameworks=[],
            tools=[]
        )

        # 6. Education
        education = []
        if sections["education"]:
            education.append(
                Education(
                    id="edu_001",
                    degree="Parsed Degree",
                    institute="Parsed Institute",
                    start_year="Unknown",
                    end_year="Unknown",
                    gpa="Unknown"
                )
            )

        # 7. Metadata
        metadata = Metadata(
            schema_version="1.0",
            last_updated=datetime.utcnow().isoformat() + "Z",
            version=1
        )

        career_profile = CareerProfile(
            contact=contact,
            profile=profile,
            experience=experience,
            projects=projects,
            skills=skills,
            education=education,
            metadata=metadata
        )

        # Calculate Deterministic Confidence Scores
        def calc_confidence(section_name: str, has_data: bool, raw_blocks: List[str]) -> float:
            score = 0.0
            if has_data:
                score += 0.50  # Base score for finding the section heading
                if len(raw_blocks) > 0:
                    score += 0.25 # Has content inside the section
                if any(re.search(r'\d{4}', b) for b in raw_blocks):
                    score += 0.15 # Has dates/years inside
                if any(len(b.split()) > 5 for b in raw_blocks):
                    score += 0.10 # Has detailed descriptions
            return round(score, 2)

        confidence = {
            "contact": 0.80 if name != "Unknown Name" and email != "unknown@example.com" else 0.40,
            "profile": calc_confidence("summary", bool(sections["summary"]), sections["summary"]),
            "experience": calc_confidence("experience", bool(sections["experience"]), sections["experience"]),
            "projects": calc_confidence("projects", bool(sections["projects"]), sections["projects"]),
            "skills": calc_confidence("skills", bool(sections["skills"]), sections["skills"]),
            "education": calc_confidence("education", bool(sections["education"]), sections["education"])
        }

        return career_profile, confidence
