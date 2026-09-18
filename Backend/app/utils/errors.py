from fastapi import Request, status
from fastapi.responses import JSONResponse
from typing import Any, Optional

class AppException(Exception):
    """Base class for application-specific errors."""
    def __init__(self, status_code: int, detail: str, code: str = "INTERNAL_ERROR", headers: Optional[dict] = None):
        self.status_code = status_code
        self.detail = detail
        self.code = code
        self.headers = headers

class NotFoundException(AppException):
    """Raised when a resource is not found."""
    def __init__(self, detail: str = "Resource not found", code: str = "NOT_FOUND", headers: Optional[dict] = None):
        super().__init__(status.HTTP_404_NOT_FOUND, detail, code, headers)

class ValidationError(AppException):
    """Raised when input validation fails."""
    def __init__(self, detail: str = "Validation failed", code: str = "VALIDATION_ERROR", headers: Optional[dict] = None):
        super().__init__(status.HTTP_400_BAD_REQUEST, detail, code, headers)

class UnauthorizedException(AppException):
    """Raised when authentication fails."""
    def __init__(self, detail: str = "Unauthorized", code: str = "UNAUTHORIZED", headers: Optional[dict] = None):
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, code, headers)

class ForbiddenException(AppException):
    """Raised when a user lacks permissions."""
    def __init__(self, detail: str = "Forbidden", code: str = "FORBIDDEN", headers: Optional[dict] = None):
        super().__init__(status.HTTP_403_FORBIDDEN, detail, code, headers)

async def app_exception_handler(request: Request, exc: AppException):
    """FastAPI exception handler for AppException and its subclasses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.detail,
            }
        },
        headers=exc.headers
    )
