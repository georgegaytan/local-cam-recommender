from typing import List

from pydantic import BaseModel


class ValidationRequest(BaseModel):
    config_id: str


class ValidationResponse(BaseModel):
    config_id: str
    is_valid: bool
    warnings: List[str]
    validation_hash: str
