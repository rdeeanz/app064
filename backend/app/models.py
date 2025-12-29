"""
SQLAlchemy ORM models for Project Investment Management System.
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Numeric, Date, 
    DateTime, Enum as SQLEnum, TypeDecorator, CHAR
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import enum

from .database import Base


# Custom UUID type that works with both PostgreSQL and SQLite
class GUID(TypeDecorator):
    """Platform-independent GUID type for SQLAlchemy."""
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return value
        else:
            return str(value) if isinstance(value, uuid.UUID) else value

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return value
        else:
            return uuid.UUID(value) if not isinstance(value, uuid.UUID) else value


class TypeInvestasi(str, enum.Enum):
    """Enum for investment types."""
    MURNI = "Murni"
    MULTI_YEAR = "Multi Year"
    CARRY_FORWARD = "Carry Forward"


class StatusIssue(str, enum.Enum):
    """Enum for issue status."""
    OPEN = "Open"
    CLOSED = "Closed"


class ProjectInvest(Base):
    """
    Main model for project investment data.
    Contains all fields for tracking investment projects including
    budget, realization, contracts, and issues.
    """
    __tablename__ = "project_invest"

    # Primary identification (custom project ID format like 'P/19.02.022-001')
    id_root = Column(String(100), primary_key=True)
    
    # Regional & Entity info
    klaster_regional = Column(String(100), default="Regional 2")
    entitas_terminal = Column(String(255))
    id_investasi = Column(String(100))
    
    # Categorization
    asset_categories = Column(String(255))
    type_investasi = Column(SQLEnum(TypeInvestasi, name="type_investasi_enum", values_callable=lambda x: [e.value for e in x]))
    tahun_usulan = Column(Integer)
    project_definition = Column(Text)
    status_investasi = Column(String(100))
    
    # Progress & Issues
    progres_description = Column(Text)
    issue_categories = Column(String(255))
    issue_description = Column(Text)
    action_target = Column(Text)
    head_office_support_desc = Column(Text)
    pic = Column(String(255))
    status_issue = Column(SQLEnum(StatusIssue, name="status_issue_enum", values_callable=lambda x: [e.value for e in x]), default=StatusIssue.OPEN)
    
    # RKAP (Budget Plan)
    tahun_rkap = Column(Integer, default=2025)
    kebutuhan_dana = Column(Numeric(18, 2), default=0)
    rkap = Column(Numeric(18, 2), default=0)
    rkap_januari = Column(Numeric(18, 2), default=0)
    rkap_februari = Column(Numeric(18, 2), default=0)
    rkap_maret = Column(Numeric(18, 2), default=0)
    rkap_april = Column(Numeric(18, 2), default=0)
    rkap_mei = Column(Numeric(18, 2), default=0)
    rkap_juni = Column(Numeric(18, 2), default=0)
    rkap_juli = Column(Numeric(18, 2), default=0)
    rkap_agustus = Column(Numeric(18, 2), default=0)
    rkap_september = Column(Numeric(18, 2), default=0)
    rkap_oktober = Column(Numeric(18, 2), default=0)
    rkap_november = Column(Numeric(18, 2), default=0)
    rkap_desember = Column(Numeric(18, 2), default=0)
    
    # Contract Information
    judul_kontrak = Column(String(500))
    nilai_kontrak = Column(Numeric(18, 2), default=0)
    penyerapan_sd_tahun_lalu = Column(Numeric(18, 2), default=0)
    
    # Realization (Monthly)
    realisasi_januari = Column(Numeric(18, 2), default=0)
    realisasi_februari = Column(Numeric(18, 2), default=0)
    realisasi_maret = Column(Numeric(18, 2), default=0)
    realisasi_april = Column(Numeric(18, 2), default=0)
    realisasi_mei = Column(Numeric(18, 2), default=0)
    realisasi_juni = Column(Numeric(18, 2), default=0)
    realisasi_juli = Column(Numeric(18, 2), default=0)
    realisasi_agustus = Column(Numeric(18, 2), default=0)
    realisasi_september = Column(Numeric(18, 2), default=0)
    realisasi_oktober = Column(Numeric(18, 2), default=0)
    realisasi_november = Column(Numeric(18, 2), default=0)
    realisasi_desember = Column(Numeric(18, 2), default=0)
    
    # Prognosis (Monthly cumulative)
    prognosa_januari = Column(Numeric(18, 2), default=0)
    prognosa_februari = Column(Numeric(18, 2), default=0)
    prognosa_maret = Column(Numeric(18, 2), default=0)
    prognosa_april = Column(Numeric(18, 2), default=0)
    prognosa_mei = Column(Numeric(18, 2), default=0)
    prognosa_juni = Column(Numeric(18, 2), default=0)
    prognosa_juli = Column(Numeric(18, 2), default=0)
    prognosa_agustus = Column(Numeric(18, 2), default=0)
    prognosa_september = Column(Numeric(18, 2), default=0)
    prognosa_oktober = Column(Numeric(18, 2), default=0)
    prognosa_november = Column(Numeric(18, 2), default=0)
    prognosa_sd_desember = Column(Numeric(18, 2), default=0)
    
    # Contract Details
    penyedia_jasa = Column(String(500))
    no_kontrak = Column(String(100))
    tanggal_kontrak = Column(Date)
    tgl_mulai_kontrak = Column(Date)
    jangka_waktu = Column(Integer)
    satuan_hari = Column(String(50), default="Hari")
    tanggal_selesai = Column(Date)
    
    # Location
    latitude = Column(Numeric(10, 7))
    longitude = Column(Numeric(10, 7))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)



