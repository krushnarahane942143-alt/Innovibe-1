from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    """Standard API response format."""
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[Any] = None

def success_response(data: Any = None, message: str = None, status_code: int = 200):
    """Return a standardized success response."""
    return APIResponse(
        success=True,
        data=data,
        message=message
    ), status_code

def error_response(message: str, error: Any = None, status_code: int = 400):
    """Return a standardized error response."""
    return APIResponse(
        success=False,
        message=message,
        error=error
    ), status_code
