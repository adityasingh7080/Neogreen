from fastapi import APIRouter
from .auth import router as auth_router
from .organizations import router as organizations_router
from .projects import router as projects_router
from .carbon import router as carbon_router
from .geospatial import router as geospatial_router
from .solar import router as solar_router
from .credits import router as credits_router
from .reports import router as reports_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(organizations_router)
api_router.include_router(projects_router)
api_router.include_router(carbon_router)
api_router.include_router(geospatial_router)
api_router.include_router(solar_router)
api_router.include_router(credits_router)
api_router.include_router(reports_router)

from . import auth
from . import projects
from app.api import auth, projects

__all__ = ["auth", "projects"]