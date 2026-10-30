from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.domain import UserRole

# Auth Schemas
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    organization_name: str
    industry: Optional[str] = "Other"

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str]
    role: UserRole
    organization_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    project_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float

class ProjectOut(BaseModel):
    id: UUID
    organization_id: UUID
    name: str
    project_type: str
    description: Optional[str]
    latitude: float
    longitude: float
    created_at: datetime

    class Config:
        from_attributes = True

# Carbon Calculation Schemas
class CarbonCalculateInput(BaseModel):
    electricity_kwh: float = 0.0
    diesel_liters: float = 0.0
    vehicle_km: float = 0.0

class CarbonCalculateResult(BaseModel):
    project_id: UUID
    scope_1_co2e: float
    scope_2_co2e: float
    total_co2e: float
    breakdown: dict
    calculated_at: datetime