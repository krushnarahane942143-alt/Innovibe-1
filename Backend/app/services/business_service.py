from typing import List, Optional
from app.models.schemas import Business
from app.services.data_loader import data_loader

class BusinessService:
    def get_businesses(
        self,
        destination_id: Optional[int] = None,
        category: Optional[str] = None,
        limit: int = 10,
        offset: int = 0
    ) -> List[Business]:
        """
        Fetch businesses with optional filtering by destination and category,
        and supports pagination via limit and offset.
        """
        businesses = data_loader.get_businesses()

        # Filtering by destination_id
        if destination_id is not None:
            businesses = [b for b in businesses if b.get("destination_id") == destination_id]

        # Filtering by category
        if category:
            businesses = [b for b in businesses if b.get("category") == category]

        # Pagination
        paginated_businesses = businesses[offset : offset + limit]

        return [Business(**b) for b in paginated_businesses]

business_service = BusinessService()
