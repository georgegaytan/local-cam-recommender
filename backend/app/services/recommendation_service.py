from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.configuration import Configuration
from app.schemas.recommendation import RecommendationRequest


class RecommendationService:
    def recommend(self, db: Session, request: RecommendationRequest) -> Configuration | None:
        # "ML" Logic: Find most similar config from last 90 days
        # Criteria: Same material, closest tool_diameter

        cutoff_date = datetime.now(timezone.utc) - timedelta(days=90)

        # Filter by material and date
        candidates = (
            db.query(Configuration)
            .filter(
                Configuration.material == request.material,
                Configuration.created_at >= cutoff_date,
            )
            .all()
        )

        if not candidates:
            return None

        # Find closest tool diameter
        best_match = min(candidates, key=lambda c: abs(c.tool_diameter - request.tool_diameter))

        return best_match
