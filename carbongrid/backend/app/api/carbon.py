from fastapi import APIRouter

router = APIRouter(prefix="/carbon", tags=["carbon"])

@router.post("/calculate")
def calculate_carbon():
    return {
        "scope_1": 0,
        "scope_2": 0,
        "total_co2e": 0,
        "unit": "tCO2e"
    }
