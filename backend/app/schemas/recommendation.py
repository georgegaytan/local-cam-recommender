from typing import Optional

from pydantic import BaseModel

from .configuration import Configuration


class RecommendationRequest(BaseModel):
    machine_id: str
    material: str
    tool_diameter: float


class RecommendationResponse(BaseModel):
    recommended_config: Optional[Configuration]
    model_version: str
    message: Optional[str] = None
