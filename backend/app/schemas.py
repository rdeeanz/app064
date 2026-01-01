"""
Pydantic schemas for request/response validation.
Provides type safety and automatic documentation for API endpoints.
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from enum import Enum

from pydantic import BaseModel, Field


class TypeInvestasi(str, Enum):
    """Investment type options."""
    MURNI = "Murni"
    MULTI_YEAR = "Multi Year"
    CARRY_FORWARD = "Carry Forward"


class StatusIssue(str, Enum):
    """Issue status options."""
    OPEN = "Open"
    CLOSED = "Closed"


class ProjectBase(BaseModel):
    """Base schema with common project fields."""
    # Regional & Entity
    klaster_regional: Optional[str] = Field(default="Regional 2", max_length=100)
    entitas_terminal: Optional[str] = Field(default=None, max_length=255)
    id_investasi: Optional[str] = Field(default=None, max_length=100)
    
    # Categorization
    asset_categories: Optional[str] = Field(default=None, max_length=255)
    type_investasi: Optional[TypeInvestasi] = None
    tahun_usulan: Optional[int] = None
    project_definition: Optional[str] = None
    status_investasi: Optional[str] = Field(default=None, max_length=100)
    
    # Progress & Issues
    progres_description: Optional[str] = None
    issue_categories: Optional[str] = Field(default=None, max_length=255)
    issue_description: Optional[str] = None
    action_target: Optional[str] = None
    head_office_support_desc: Optional[str] = None
    pic: Optional[str] = Field(default=None, max_length=255)
    status_issue: Optional[StatusIssue] = Field(default=StatusIssue.OPEN)
    
    # RKAP
    tahun_rkap: Optional[int] = Field(default=2025)
    kebutuhan_dana: Optional[Decimal] = Field(default=Decimal("0"))
    rkap: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_januari: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_februari: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_maret: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_april: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_mei: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_juni: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_juli: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_agustus: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_september: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_oktober: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_november: Optional[Decimal] = Field(default=Decimal("0"))
    rkap_desember: Optional[Decimal] = Field(default=Decimal("0"))
    
    # Contract
    judul_kontrak: Optional[str] = Field(default=None, max_length=500)
    nilai_kontrak: Optional[Decimal] = Field(default=Decimal("0"))
    penyerapan_sd_tahun_lalu: Optional[Decimal] = Field(default=Decimal("0"))
    
    # Realization
    realisasi_januari: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_februari: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_maret: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_april: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_mei: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_juni: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_juli: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_agustus: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_september: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_oktober: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_november: Optional[Decimal] = Field(default=Decimal("0"))
    realisasi_desember: Optional[Decimal] = Field(default=Decimal("0"))
    
    # Prognosis
    prognosa_januari: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_februari: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_maret: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_april: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_mei: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_juni: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_juli: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_agustus: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_september: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_oktober: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_november: Optional[Decimal] = Field(default=Decimal("0"))
    prognosa_sd_desember: Optional[Decimal] = Field(default=Decimal("0"))
    
    # Contract Details
    penyedia_jasa: Optional[str] = Field(default=None, max_length=500)
    no_kontrak: Optional[str] = Field(default=None, max_length=100)
    tanggal_kontrak: Optional[date] = None
    tgl_mulai_kontrak: Optional[date] = None
    jangka_waktu: Optional[int] = None
    satuan_hari: Optional[str] = Field(default="Hari", max_length=50)
    tanggal_selesai: Optional[date] = None
    kontrak_aktif: Optional[str] = Field(default=None, max_length=10)
    
    # Location
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class ProjectCreate(ProjectBase):
    """Schema for creating a new project."""
    id_root: str = Field(..., max_length=100, description="Primary project ID (e.g., 'P/19.02.022-001')")
    id_investasi: str = Field(..., max_length=100, description="Unique investment ID")
    project_definition: str = Field(..., description="Project definition/description")


class ProjectUpdate(ProjectBase):
    """Schema for full project update."""
    pass


class ProjectProgressUpdate(BaseModel):
    """Schema for updating project progress only."""
    progres_description: Optional[str] = None
    status_investasi: Optional[str] = Field(default=None, max_length=100)
    
    # Monthly realization can be updated via progress
    realisasi_januari: Optional[Decimal] = None
    realisasi_februari: Optional[Decimal] = None
    realisasi_maret: Optional[Decimal] = None
    realisasi_april: Optional[Decimal] = None
    realisasi_mei: Optional[Decimal] = None
    realisasi_juni: Optional[Decimal] = None
    realisasi_juli: Optional[Decimal] = None
    realisasi_agustus: Optional[Decimal] = None
    realisasi_september: Optional[Decimal] = None
    realisasi_oktober: Optional[Decimal] = None
    realisasi_november: Optional[Decimal] = None
    realisasi_desember: Optional[Decimal] = None


class ProjectIssueUpdate(BaseModel):
    """Schema for updating project issues."""
    issue_categories: Optional[str] = Field(default=None, max_length=255)
    issue_description: Optional[str] = None
    action_target: Optional[str] = None
    head_office_support_desc: Optional[str] = None
    status_issue: Optional[StatusIssue] = None


class ProjectResponse(ProjectBase):
    """Schema for project response with all fields."""
    id_root: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """Schema for paginated project list response."""
    total: int
    items: list[ProjectResponse]
    page: int
    page_size: int


class FilterOptionsResponse(BaseModel):
    """Schema for filter options response."""
    tgl_mulai_options: list[date]
    tgl_selesai_options: list[date]
    kontrak_aktif_options: list[Optional[str]]
