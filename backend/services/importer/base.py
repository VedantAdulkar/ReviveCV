from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any
from backend.schemas.backend_schemas import CareerProfile

class BaseImporter(ABC):
    """
    Abstract interface for Resume Importers.
    Implementations handle specific file types (PDF, DOCX).
    """

    @abstractmethod
    def import_resume(self, file_path: str) -> Tuple[CareerProfile, Dict[str, float]]:
        """
        Imports a resume and maps it to a CareerProfile.
        Returns the CareerProfile and a dictionary of confidence scores.
        """
        pass
