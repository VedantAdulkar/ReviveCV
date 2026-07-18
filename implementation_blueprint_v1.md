
# AI Career Intelligence Platform
## Product Requirements & Implementation Blueprint (MVP v1)

> **Role Assumption:** Senior AI Engineer (10+ years)
>
> **Objective:** Build a privacy-first, local AI application that maintains a Master Resume Database and generates ATS-friendly, job-specific resume recommendations using a local Qwen2:8B model through Ollama.

---

# 1. Vision

## Problem

Traditional resumes become outdated quickly. Users repeatedly edit DOCX files, duplicate resumes for different companies, and lose track of projects, promotions, achievements, certifications, and publications.

The resume should **not** be the source of truth.

## Solution

Create a **Career Intelligence Platform**.

The platform stores every career asset in a structured **Master Resume JSON**.

Whenever a Job Description (JD) is provided, AI analyzes:

- Resume vs JD
- Project relevance
- Skill relevance
- ATS optimization
- Resume summary
- Cover letter

The AI **never edits automatically**. Every suggestion is reviewed and approved by the user.

---

# 2. Core Principles

1. Privacy-first
2. Offline-first
3. Local AI (Qwen2:8B via Ollama)
4. Master Resume JSON is the single source of truth
5. Resume is a generated artifact
6. Human approval before any change
7. AI never hallucinates
8. Deterministic outputs
9. ATS compatible
10. Modular architecture

---

# 3. Scope (MVP)

Included:
- Import existing resume
- Extract structured profile
- Edit career profile through UI
- Store Master Resume JSON
- Analyze Job Description
- AI suggestions
- Human approval
- Generate ATS-friendly PDF/DOCX
- Generate cover letter
- Portfolio QR code

Not Included:
- Auto job apply
- Browser automation
- RAG
- Cloud sync
- Multi-user collaboration

---

# 4. Technology Stack

Frontend:
- React
- TypeScript
- TailwindCSS

Backend:
- FastAPI
- Pydantic
- Jinja2 (optional templates)

AI:
- Ollama
- Qwen2:8B

Storage:
- master_resume.json
- settings.json
- generated resumes

Document:
- python-docx
- ReportLab
- qrcode

---

# 5. High-Level Architecture

Career Profile UI
        |
        v
Master Resume JSON
        |
        v
Prompt Builder
        |
        v
Qwen2:8B (Ollama)
        |
        v
Strict JSON Response
        |
        v
Validation Layer
        |
        v
Review Screen
        |
        v
Resume Generator
        |
        +--> PDF
        +--> DOCX

---

# 6. Screens

## Dashboard

Cards:
- Profile Completion
- Experience
- Projects
- Skills
- Education
- Certifications
- Publications
- Achievements
- Generate Resume

Navigation:
- Contact
- Experience
- Projects
- Skills
- Resume Generator
- Settings

---

## Contact (KYC Style)

Fields:
- Full Name
- Headline
- Email
- Phone
- City
- State
- Country
- LinkedIn
- GitHub
- Portfolio
- LeetCode
- Kaggle
- Google Scholar
- ORCID
- Medium
- Twitter/X

Rule:
Portfolio URL is converted to a QR code and rendered at the top-right of every generated resume.

This is mandatory.

---

## Experience

Table view.

Each company may contain multiple roles.

Each role:
- Title
- Department
- Start Month
- End Month
- Current
- Responsibilities
- Achievements
- Tech Stack
- Projects

Promotion creates a new role entry.
Never overwrite history.

---

## Projects

Editable grid.

Columns:
- Name
- Domain
- Active
- Featured
- Resume Enabled
- Last Updated

Project details:
- Problem
- Solution
- Architecture
- Responsibilities
- Technologies
- Skills
- GitHub
- Live Demo
- Documentation
- Keywords
- Metrics
- Screenshots

Business Rule:
Projects are never deleted by AI.

---

## Skills

Categories:
- Languages
- Frameworks
- Libraries
- AI/ML
- LLM
- Computer Vision
- Backend
- Databases
- Cloud
- DevOps
- Tools

Skill attributes:
- Name
- Level
- Years
- Last Used

---

## Education

Multiple entries.

Degree
Institute
CGPA
Start
End

---

## Certifications

Name
Issuer
Credential
Issue Date
Expiry

---

## Publications

Title
Authors
Conference
Publisher
DOI
URL
Published Date

---

## Achievements

Title
Description
Date
Proof URL

---

# 7. Master Resume JSON

Top Level

contact
profile
experience
projects
skills
education
certifications
publications
achievements
leadership
awards
preferences
metadata

Facts must be stored.
Presentation must NOT be stored.

---

# 8. AI Workflow

Input:
- Master Resume JSON
- Company
- Role
- Job Description

Prompt Builder composes one deterministic prompt.

Qwen2:8B returns JSON only.

No markdown.

No prose.

---

# 9. AI Responsibilities

Return:
- Match Score
- ATS Score
- Strong Matches
- Weak Matches
- Missing Keywords
- Missing Skills
- Ranked Projects
- Ranked Skills
- Summary Suggestion
- Bullet Suggestions
- Projects to De-emphasize
- Cover Letter
- Recruiter Email

Every suggestion MUST contain:
- Current
- Suggested
- Reason

---

# 10. AI Rules

Never:
- invent skills
- invent metrics
- invent dates
- invent projects
- invent employers
- invent publications

Only:
- reorder
- rewrite
- summarize
- recommend

---

# 11. Review Workflow

Every suggestion appears as a review card.

Current

↓

Suggested

↓

Reason

↓

Accept / Reject

Nothing is modified until accepted.

---

# 12. Resume Generator

Rules:
- Single column
- ATS-friendly
- Standard headings
- No decorative graphics
- Portfolio QR code only
- Chronological order
- Maximum two pages unless user requests otherwise

QR code position:
Top-right (always).

---

# 13. FastAPI APIs

POST /resume/import
POST /resume/save
GET /resume
PUT /resume/project
PUT /resume/experience
PUT /resume/skills
POST /analyze
POST /generate/resume
POST /generate/cover-letter

---

# 14. Prompt Strategy

System Prompt:
Defines rules.

User Prompt:
Contains:
- Resume JSON
- JD
- Company
- Role

Model:
Qwen2:8B

Temperature:
0.2

Output:
Strict JSON.

---

# 15. Validation

Reject responses if:
- Invalid JSON
- Unknown project referenced
- Unknown skill referenced
- Missing required keys

Retry automatically once.

---

# 16. Versioning

Every save increments version.

Keep:
- timestamp
- author
- change summary

Future feature:
Resume diff.

---

# 17. Future Roadmap

Phase 2
- Resume templates
- Version comparison

Phase 3
- Job tracker
- Interview tracker

Phase 4
- Career Knowledge Graph
- GitHub sync
- LinkedIn sync

---

# 18. Success Criteria

The system is successful when:
- User never edits DOCX directly.
- Resume is always generated from Master Resume JSON.
- AI suggestions are explainable.
- Resume remains ATS compatible.
- All changes are user-approved.
- Entire system runs locally with Qwen2:8B.
