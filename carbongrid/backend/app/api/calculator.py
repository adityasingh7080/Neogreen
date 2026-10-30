from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ActivityData(BaseModel):
    # Scope 2
    electricity_kwh: float = 0
    # Scope 1
    diesel_liters: float = 0
    vehicle_km: float = 0
    # Scope 3
    flight_hours: float = 0
    employee_commute_km: float = 0
    waste_kg: float = 0

@router.post("/calculate")
async def calculate_footprint(data: ActivityData):
    # Scope 1 Calculation
    diesel_emissions = data.diesel_liters * 2.68
    vehicle_emissions = data.vehicle_km * 0.17
    scope1 = diesel_emissions + vehicle_emissions

    # Scope 2 Calculation
    electricity_emissions = data.electricity_kwh * 0.82
    scope2 = electricity_emissions

    # Scope 3 Calculation (Air travel, commuting, waste)
    flight_emissions = data.flight_hours * 90.0          # ~90 kg CO2e per flight hour
    commute_emissions = data.employee_commute_km * 0.12  # ~0.12 kg CO2e per passenger km
    waste_emissions = data.waste_kg * 0.45               # ~0.45 kg CO2e per kg landfill waste
    scope3 = flight_emissions + commute_emissions + waste_emissions

    total = scope1 + scope2 + scope3

    return {
        "total_co2e": round(total, 2),
        "scope_1_co2e": round(scope1, 2),
        "scope_2_co2e": round(scope2, 2),
        "scope_3_co2e": round(scope3, 2),
        "breakdown": {
            "electricity": round(electricity_emissions, 2),
            "diesel_generators": round(diesel_emissions, 2),
            "vehicles": round(vehicle_emissions, 2),
            "flights": round(flight_emissions, 2),
            "commute": round(commute_emissions, 2),
            "waste": round(waste_emissions, 2)
        }
    }
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import CalculationHistory

router = APIRouter()

class ActivityData(BaseModel):
    electricity_kwh: float = 0
    diesel_liters: float = 0
    vehicle_km: float = 0
    flight_hours: float = 0
    employee_commute_km: float = 0
    waste_kg: float = 0

@router.post("/calculate")
async def calculate_footprint(data: ActivityData, db: Session = Depends(get_db)):
    # Scope 1 Calculations
    diesel_emissions = data.diesel_liters * 2.68
    vehicle_emissions = data.vehicle_km * 0.17
    scope1 = diesel_emissions + vehicle_emissions

    # Scope 2 Calculation
    electricity_emissions = data.electricity_kwh * 0.82
    scope2 = electricity_emissions

    # Scope 3 Calculations
    flight_emissions = data.flight_hours * 90.0
    commute_emissions = data.employee_commute_km * 0.12
    waste_emissions = data.waste_kg * 0.45
    scope3 = flight_emissions + commute_emissions + waste_emissions

    total = scope1 + scope2 + scope3

    # Save to SQLite DB
    history_record = CalculationHistory(
        total_co2e=round(total, 2),
        scope_1_co2e=round(scope1, 2),
        scope_2_co2e=round(scope2, 2),
        scope_3_co2e=round(scope3, 2),
        electricity_kwh=data.electricity_kwh,
        diesel_liters=data.diesel_liters,
        vehicle_km=data.vehicle_km,
        flight_hours=data.flight_hours,
        employee_commute_km=data.employee_commute_km,
        waste_kg=data.waste_kg,
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    return {
        "id": history_record.id,
        "total_co2e": round(total, 2),
        "scope_1_co2e": round(scope1, 2),
        "scope_2_co2e": round(scope2, 2),
        "scope_3_co2e": round(scope3, 2),
        "breakdown": {
            "electricity": round(electricity_emissions, 2),
            "diesel_generators": round(diesel_emissions, 2),
            "vehicles": round(vehicle_emissions, 2),
            "flights": round(flight_emissions, 2),
            "commute": round(commute_emissions, 2),
            "waste": round(waste_emissions, 2)
        }
    }

@router.get("/history")
async def get_history(db: Session = Depends(get_db)):
    records = db.query(CalculationHistory).order_by(CalculationHistory.timestamp.desc()).limit(10).all()
    return records