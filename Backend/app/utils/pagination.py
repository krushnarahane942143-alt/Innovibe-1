from typing import Any, Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")

class PaginationParams(BaseModel):
    """Request parameters for pagination."""
    page: int = 1
    size: int = 10

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size

class PaginatedResponse(BaseModel, Generic[T]):
    """Standard response for paginated data."""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int

def paginate(items: List[Any], total: int, page: int, size: int) -> PaginatedResponse:
    """Helper to create a paginated response."""
    import math
    pages = math.ceil(total / size) if size > 0 else 0
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )
