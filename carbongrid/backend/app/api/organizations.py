from fastapi import APIRouter

router = APIRouter(prefix="/organizations", tags=["organizations"])

@router.get("")
def list_organizations():
    return []
