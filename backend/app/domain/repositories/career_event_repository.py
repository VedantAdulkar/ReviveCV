from typing import Protocol, List
from app.domain.models.career_event import CareerEvent

class CareerEventRepository(Protocol):
    """
    Protocol defining the interface for storing and retrieving Career Events.
    Implementation is deferred to the Infrastructure layer.
    """
    
    def append(self, event: CareerEvent) -> None:
        """Appends a new CareerEvent to the event store."""
        ...

    def list_all(self) -> List[CareerEvent]:
        """Retrieves all CareerEvents in chronological order."""
        ...
