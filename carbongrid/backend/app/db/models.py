from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from datetime import datetime
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

class CalculationHistory(Base):
    __tablename__ = "calculation_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    total_co2e = Column(Float)
    scope_1_co2e = Column(Float)
    scope_2_co2e = Column(Float)
    scope_3_co2e = Column(Float)
    electricity_kwh = Column(Float)
    diesel_liters = Column(Float)
    vehicle_km = Column(Float)
    flight_hours = Column(Float)
    employee_commute_km = Column(Float)
    waste_kg = Column(Float)

class SatelliteAnalysisHistory(Base):
    __tablename__ = "satellite_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    latitude = Column(Float)
    longitude = Column(Float)
    green_coverage_percent = Column(Float)
    built_coverage_percent = Column(Float)
    co2_absorption_tons = Column(Float)
    estimated_emissions_tons = Column(Float)
    net_carbon_balance = Column(Float)