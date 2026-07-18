import pytest
from fastapi.testclient import TestClient
from backend.main import app
import io

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ReviveCV API is running"}

def test_import_unsupported_format():
    # Attempting to upload a PDF when only DOCX is supported
    dummy_file = io.BytesIO(b"dummy pdf content")
    files = {"file": ("resume.pdf", dummy_file, "application/pdf")}
    
    response = client.post("/career-profile/import", files=files)
    
    assert response.status_code == 400
    assert "Only DOCX format is currently supported" in response.json()["detail"]

def test_import_valid_format_but_corrupt():
    # Attempting to upload a corrupt DOCX file
    dummy_file = io.BytesIO(b"corrupt docx content")
    files = {"file": ("resume.docx", dummy_file, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    
    response = client.post("/career-profile/import", files=files)
    
    # It should fail safely (500) because docx.Document() will throw an error on corrupt files
    assert response.status_code == 500
