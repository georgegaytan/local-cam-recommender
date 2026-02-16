from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.configuration import Configuration
from app.schemas.validation import ValidationRequest, ValidationResponse
from app.services.validation_service import ValidationService

router = APIRouter()
validation_service = ValidationService()


@router.post("/", response_model=ValidationResponse)
def validate_config(request: ValidationRequest, db: Session = Depends(get_db)):
    db_config = db.query(Configuration).filter(Configuration.id == request.config_id).first()
    if not db_config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    result = validation_service.validate(db_config)

    # In a real system, we'd save the result for audit
    db.add(result)
    db.commit()

    return ValidationResponse(
        config_id=result.config_id,
        is_valid=result.is_valid,
        warnings=result.warnings,
        validation_hash=result.validation_hash,
    )
