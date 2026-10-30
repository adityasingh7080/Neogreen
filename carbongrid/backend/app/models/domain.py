import enum
import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN"
    ANALYST = "ANALYST"
    VIEWER = "VIEWER"


class ProjectType(str, enum.Enum):
    CORPORATE_CAMPUS = "CORPORATE_CAMPUS"
    FACTORY = "FACTORY"
    UNIVERSITY = "UNIVERSITY"
    HOSPITAL = "HOSPITAL"
    RESIDENTIAL = "RESIDENTIAL"
    OTHER = "OTHER"


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name = Column(String(255), nullable=False)
    industry = Column(String(255), nullable=True)

    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    users = relationship(
        "User",
        back_populates="organization",
        cascade="all, delete-orphan",
    )

    projects = relationship(
        "Project",
        back_populates="organization",
        cascade="all, delete-orphan",
    )


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(
        String(500),
        nullable=False,
    )

    full_name = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        Enum(UserRole, name="user_role"),
        default=UserRole.ORGANIZATION_ADMIN,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    organization = relationship(
        "Organization",
        back_populates="users",
    )


class Project(Base):
    __tablename__ = "projects"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(
        String(255),
        nullable=False,
    )

    project_type = Column(
        Enum(ProjectType, name="project_type"),
        default=ProjectType.OTHER,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    organization = relationship(
        "Organization",
        back_populates="projects",
    )

    carbon_calculations = relationship(
        "CarbonCalculation",
        back_populates="project",
        cascade="all, delete-orphan",
    )


class CarbonCalculation(Base):
    __tablename__ = "carbon_calculations"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )

    scope_1_co2e = Column(
        Float,
        nullable=False,
    )

    scope_2_co2e = Column(
        Float,
        nullable=False,
    )

    total_co2e = Column(
        Float,
        nullable=False,
    )

    input_payload = Column(
        JSON,
        nullable=False,
    )

    calculated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    project = relationship(
        "Project",
        back_populates="carbon_calculations",
    )