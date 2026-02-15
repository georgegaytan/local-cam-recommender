from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.configuration import Configuration
from app.schemas.configuration import ConfigurationCreate, Configuration as ConfigurationSchema

router = APIRouter()

@router.post("/", response_model=ConfigurationSchema)
def create_config(config: ConfigurationCreate, db: Session = Depends(get_db)):
    db_config = Configuration(**config.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.get("/{config_id}", response_model=ConfigurationSchema)
def read_config(config_id: str, db: Session = Depends(get_db)):
    db_config = db.query(Configuration).filter(Configuration.id == config_id).first()
    if db_config is None:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return db_config

@router.get("/", response_model=list[ConfigurationSchema])
def list_configs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    configs = db.query(Configuration).offset(skip).limit(limit).all()
    return configs
