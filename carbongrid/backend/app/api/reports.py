from fastapi import APIRouter

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/status")
def status():
    return {"status": "MVP_SUMMARY_ONLY"}
