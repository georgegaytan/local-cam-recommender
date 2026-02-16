import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.sqlite import JSON

from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Configuration(Base):
    __tablename__ = "configurations"

    id = Column(String, primary_key=True, default=generate_uuid)
    machine_id = Column(String, index=True)
    material = Column(String, index=True)
    tool_diameter = Column(Float)
    feed_rate = Column(Float)
    spindle_speed = Column(Integer)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    version = Column(Integer, default=1)

    # Relationships can be added here
    # validation_results = relationship("ValidationResult", back_populates="configuration")


class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(String, primary_key=True, default=generate_uuid)
    config_id = Column(String, ForeignKey("configurations.id"))
    is_valid = Column(Boolean)
    warnings = Column(JSON)  # Storing list of warnings as JSON
    validation_hash = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RecommendationEvent(Base):
    __tablename__ = "recommendation_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    input_snapshot = Column(JSON)  # Snapshot of the input criteria
    recommended_config_id = Column(String, ForeignKey("configurations.id"))
    model_version = Column(String)
    accepted = Column(Boolean, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
