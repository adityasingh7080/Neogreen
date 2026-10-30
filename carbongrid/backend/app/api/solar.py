from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SolarCalculationRequest(BaseModel):
    rooftop_area_sqm: float
    panel_efficiency_percent: float = 20.0
    average_sunshine_hours_per_day: float = 5.5
    electricity_cost_per_kwh: float = 0.12

@router.post("/calculate")
async def calculate_solar_potential(data: SolarCalculationRequest):
    # Total annual solar energy hitting rooftop (kWh)
    total_area_sqm = data.rooftop_area_sqm
    efficiency = data.panel_efficiency_percent / 100.0
    daily_hours = data.average_sunshine_hours_per_day
    cost_per_kwh = data.electricity_cost_per_kwh

    # Standard solar irradiance approx 1 kW/m² under standard test conditions
    annual_generation_kwh = round(total_area_sqm * efficiency * daily_hours * 365 * 0.75, 2)  # 0.75 derating factor
    annual_co2_offset_tons = round((annual_generation_kwh * 0.82) / 1000.0, 2)  # Grid factor ~0.82 kg CO2/kWh
    annual_cost_savings = round(annual_generation_kwh * cost_per_kwh, 2)
    estimated_setup_cost = round(total_area_sqm * 120.0, 2)  # ~120 currency units per sqm installed
    payback_years = round(estimated_setup_cost / annual_cost_savings, 1) if annual_cost_savings > 0 else 0

    return {
        "rooftop_area_sqm": total_area_sqm,
        "panel_efficiency_percent": data.panel_efficiency_percent,
        "average_sunshine_hours_per_day": daily_hours,
        "annual_generation_kwh": annual_generation_kwh,
        "annual_co2_offset_tons": annual_co2_offset_tons,
        "annual_cost_savings": annual_cost_savings,
        "estimated_setup_cost": estimated_setup_cost,
        "payback_years": payback_years,
    }