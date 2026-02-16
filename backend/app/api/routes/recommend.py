from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()
recommendation_service = RecommendationService()


@router.post("/", response_model=RecommendationResponse)
def recommend_config(request: RecommendationRequest, db: Session = Depends(get_db)):
    recommended_config = recommendation_service.recommend(db, request)

    if recommended_config:
        return RecommendationResponse(
            recommended_config=recommended_config,
            model_version="v0.1",
            message="Recommendation found based on similar past configurations.",
        )
    else:
        return RecommendationResponse(
            recommended_config=None,
            model_version="v0.1",
            message="No suitable recommendation found.",
        )
