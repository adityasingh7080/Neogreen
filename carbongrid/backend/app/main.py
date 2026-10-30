from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, projects, calculator, satellite, solar, offset
from app.db.session import engine, Base
import app.db.models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="AI-powered geospatial sustainability platform",
)

# Allow all origins, methods, and headers explicitly
# Allow all origins dynamically without wildcard conflict
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(calculator.router, prefix="/api/v1/calculator", tags=["calculator"])
app.include_router(satellite.router, prefix="/api/v1/satellite", tags=["satellite"])
app.include_router(solar.router, prefix="/api/v1/solar", tags=["solar"])
app.include_router(offset.router, prefix="/api/v1/offset", tags=["offset"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}