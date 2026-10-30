from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class OffsetSimulationRequest(BaseModel):
    current_emissions_tons: float
    reforestation_trees: int = 1000
    rec_mwh: float = 500.0
    carbon_credits_purchased: int = 200

@router.post("/simulate")
async def simulate_offset_strategy(data: OffsetSimulationRequest):
    # Standard environmental reduction factors
    # 1 mature tree absorbs ~0.022 tons CO2/year
    reforestation_offset = round(data.reforestation_trees * 0.022, 2)
    # 1 MWh REC offsets ~0.82 tons CO2
    rec_offset = round(data.rec_mwh * 0.82, 2)
    # 1 Verified Carbon Credit = 1 ton CO2
    credit_offset = round(float(data.carbon_credits_purchased), 2)

    total_offset = round(reforestation_offset + rec_offset + credit_offset, 2)
    net_remaining_emissions = max(0.0, round(data.current_emissions_tons - total_offset, 2))
    offset_percentage = min(100.0, round((total_offset / data.current_emissions_tons) * 100, 1)) if data.current_emissions_tons > 0 else 100.0

    # Estimated costs
    tree_cost = data.reforestation_trees * 15  # $15 per tree
    rec_cost = data.rec_mwh * 25               # $25 per REC MWh
    credit_cost = data.carbon_credits_purchased * 30  # $30 per carbon credit
    total_cost = round(tree_cost + rec_cost + credit_cost, 2)

    return {
        "current_emissions": data.current_emissions_tons,
        "reforestation_offset": reforestation_offset,
        "rec_offset": rec_offset,
        "credit_offset": credit_offset,
        "total_offset": total_offset,
        "net_remaining_emissions": net_remaining_emissions,
        "offset_percentage": offset_percentage,
        "total_cost": total_cost,
    }