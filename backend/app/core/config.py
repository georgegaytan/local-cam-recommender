import os

class Settings:
    PROJECT_NAME: str = "Local CAM Recommender"
    PROJECT_VERSION: str = "0.1.0"
    
    # SQLite local database
    DATABASE_URL: str = "sqlite:///./local_cam.db"
    
    # Validation constraints (example)
    MAX_SPINDLE_SPEED: int = 20000
    
settings = Settings()
