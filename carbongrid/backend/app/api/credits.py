from fastapi import APIRouter

router = APIRouter(prefix="/credits", tags=["green-credits"])

@router.get("/status")
def status():
    return {"status": "POST_MVP"}
