from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import SatelliteAnalysisHistory

router = APIRouter()

class SatelliteAnalysisRequest(BaseModel):
    latitude: float
    longitude: float

@router.post("/analyze")
async def analyze_satellite_zone(data: SatelliteAnalysisRequest, db: Session = Depends(get_db)):
    # Simulating GIS/Satellite spatial analysis calculations
    # In production, this can connect to Sentinel-2 or Google Earth Engine APIs
    seed = (data.latitude + data.longitude) % 1.0
    green_coverage = round(15.0 + (seed * 20.0), 1)
    built_coverage = round(100.0 - green_coverage, 1)
    
    co2_absorption = round(green_coverage * 38.8, 1)
    estimated_emissions = round(built_coverage * 88.1, 1)
    net_balance = round(co2_absorption - estimated_emissions, 1)
    ndgi_index = round(0.15 + (seed * 0.35), 2)

    # Persist scan history to SQLite
    history_record = SatelliteAnalysisHistory(
        latitude=data.latitude,
        longitude=data.longitude,
        green_coverage_percent=green_coverage,
        built_coverage_percent=built_coverage,
        co2_absorption_tons=co2_absorption,
        estimated_emissions_tons=estimated_emissions,
        net_carbon_balance=net_balance,
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    return {
        "id": history_record.id,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "areaHa": 176.3,
        "greenCoverage": green_coverage,
        "builtCoverage": built_coverage,
        "co2Absorption": co2_absorption,
        "co2Emissions": estimated_emissions,
        "netBalance": net_balance,
        "ndgiIndex": ndgi_index,
    }