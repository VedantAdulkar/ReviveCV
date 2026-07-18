# Create python virtual environment
Write-Host "Creating Python virtual environment..."
python -m venv venv
.\venv\Scripts\activate

# Install backend dependencies
Write-Host "Installing backend dependencies..."
pip install fastapi uvicorn pydantic python-docx reportlab qrcode Jinja2 python-multipart

# Check if Ollama is installed
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "Ollama is already installed."
} else {
    Write-Host "Ollama not found. Please install Ollama from https://ollama.com/download/windows"
    Write-Host "After installing Ollama, run: ollama run qwen3:8b"
}

# Pull the Qwen3:8B model
Write-Host "Pulling Qwen3:8B model..."
ollama pull qwen3:8b

Write-Host "Setup complete!"
