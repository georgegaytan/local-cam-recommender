from pydantic import BaseModel
from typing import List, Optional

class ValidationRequest(BaseModel):
    config_id: str

class ValidationResponse(BaseModel):
    config_id: str
    is_valid: bool
    warnings: List[str]
    validation_hash: str
