# ReviveCV

> **A Git + CI/CD system for your Professional Identity.**

ReviveCV fundamentally shifts how you manage your career artifacts. Instead of maintaining disparate Word documents or treating your resume as a one-off optimization task, ReviveCV treats your professional identity like a codebase.

## Core Concepts

1. **Career Profile (Main Branch)**: An immutable, event-sourced timeline of your professional achievements, skills, and experiences.
2. **Branches (Workspaces)**: Intent-driven workspaces (e.g., "AI Engineer", "Backend Developer") tailored to specific career trajectories.
3. **Evolution Engine**: Automatically detects new events in your Career Profile and uses AI to seamlessly sync relevant changes into your branches.
4. **Sessions**: Reproducible AI optimization workflows tied to specific job descriptions or profile syncs.

## Tech Stack

- **Backend**: FastAPI (Python), Local JSON Storage (Event Sourcing & Document DB patterns)
- **Frontend**: React, Vite, Tailwind CSS, Zustand, React Router, Lucide React
- **AI**: Qwen3:8B (via Ollama) used deterministically for impact analysis and suggestions.

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173/dashboard` to view the Branch Dashboard.
