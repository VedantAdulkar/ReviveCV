from abc import ABC, abstractmethod
from typing import Dict, Any

class AIClient(ABC):
    """
    Abstract interface for AI interactions.
    Enforces that the rest of the application doesn't know the exact provider.
    """
    
    @abstractmethod
    def generate(self, prompt: str, model: str) -> str:
        """
        Takes a compiled prompt and model identifier, returns raw text.
        """
        pass
