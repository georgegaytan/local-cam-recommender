from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ConfigurationBase(BaseModel):
    machine_id: str
    material: str
    tool_diameter: float
    feed_rate: float
    spindle_speed: int


class ConfigurationCreate(ConfigurationBase):
    pass


class ConfigurationUpdate(ConfigurationBase):
    pass


class Configuration(ConfigurationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    version: int

    model_config = ConfigDict(from_attributes=True)
