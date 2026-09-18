import logging
import json
import sys
from datetime import datetime
from typing import Any

class JSONFormatter(logging.Formatter):
    """Custom logging formatter to output logs in JSON format."""
    def format(self, record: logging.LogRecord) -> str:
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "funcName": record.funcName,
            "lineno": record.lineno,
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)

        # Include extra fields if provided
        if hasattr(record, "extra"):
            log_record.update(record.extra)

        return json.dumps(log_record)

def setup_logging(level: int = logging.INFO):
    """Configure the application to use JSON logging."""
    logger = logging.getLogger()
    logger.setLevel(level)

    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    logger.addHandler(handler)

    logging.info("Logging initialized with JSON formatter")

# Initialize logging immediately upon import if needed,
# but typically called in the main app entry point.
