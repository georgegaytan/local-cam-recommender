from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import config, health, recommend, validate
from app.core.config import settings
from app.core.database import Base, engine

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be specific
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(config.router, prefix="/config", tags=["Configuration"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommendation"])
app.include_router(validate.router, prefix="/validate", tags=["Validation"])
app.include_router(health.router, prefix="/health", tags=["Health"])


@app.get("/")
def root():
    return {"message": "Local CAM Recommender API"}
