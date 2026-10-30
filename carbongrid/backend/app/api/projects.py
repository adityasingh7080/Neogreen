from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.domain import User, Project, CarbonCalculation
from app.schemas.domain import (
    ProjectCreate,
    ProjectOut,
    CarbonCalculateInput,
    CarbonCalculateResult,
)
from app.services.carbon_engine import calculate_carbon_footprint

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(
        organization_id=current_user.organization_id,
        name=payload.name,
        project_type=payload.project_type,
        description=payload.description,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=List[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Project)
        .filter(Project.organization_id == current_user.organization_id)
        .all()
    )


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.organization_id == current_user.organization_id,
        )
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    return project


@router.post("/{project_id}/carbon/calculate", response_model=CarbonCalculateResult)
def calculate_project_carbon(
    project_id: UUID,
    payload: CarbonCalculateInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.organization_id == current_user.organization_id,
        )
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    s1, s2, total, breakdown = calculate_carbon_footprint(
        electricity_kwh=payload.electricity_kwh,
        diesel_liters=payload.diesel_liters,
        vehicle_km=payload.vehicle_km,
    )

    calc = CarbonCalculation(
        project_id=project.id,
        scope_1_co2e=s1,
        scope_2_co2e=s2,
        total_co2e=total,
        input_payload=payload.model_dump(),
    )
    db.add(calc)
    db.commit()
    db.refresh(calc)

    return CarbonCalculateResult(
        project_id=project.id,
        scope_1_co2e=s1,
        scope_2_co2e=s2,
        total_co2e=total,
        breakdown=breakdown,
        calculated_at=calc.calculated_at,
    )