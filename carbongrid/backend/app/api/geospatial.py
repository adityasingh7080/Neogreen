from fastapi import APIRouter

router = APIRouter(prefix="/geospatial", tags=["geospatial"])

@router.post("/analyze")
def analyze():
    return {"status": "COMPLETED", "provider": "mock"}
