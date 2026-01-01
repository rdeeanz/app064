"""
API endpoints for project investment management.
Provides RESTful CRUD operations for projects.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/filter-options", response_model=schemas.FilterOptionsResponse)
def get_filter_options(db: Session = Depends(get_db)):
    """
    Get available filter options from project_invest table.
    """
    return crud.get_filter_options(db)

@router.get("", response_model=schemas.ProjectListResponse)
def list_projects(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    klaster_regional: Optional[str] = Query(None, description="Filter by regional cluster"),
    tahun_rkap: Optional[int] = Query(None, description="Filter by RKAP year"),
    status_issue: Optional[str] = Query(None, description="Filter by issue status"),
    db: Session = Depends(get_db)
):
    """
    Get paginated list of projects with optional filters.
    
    - **page**: Page number (starts from 1)
    - **page_size**: Number of items per page (max 100)
    - **klaster_regional**: Filter by regional cluster
    - **tahun_rkap**: Filter by RKAP year
    - **status_issue**: Filter by issue status (Open/Closed)
    """
    skip = (page - 1) * page_size
    projects, total = crud.get_projects(
        db,
        skip=skip,
        limit=page_size,
        klaster_regional=klaster_regional,
        tahun_rkap=tahun_rkap,
        status_issue=status_issue
    )
    
    return schemas.ProjectListResponse(
        total=total,
        items=projects,
        page=page,
        page_size=page_size
    )


@router.get("/stats", response_model=dict)
def get_statistics(
    tahun_rkap: Optional[int] = Query(None, description="Filter by RKAP year"),
    db: Session = Depends(get_db)
):
    """
    Get summary statistics for dashboard.
    
    Returns total projects, total RKAP, total contract value, and open issues count.
    """
    return crud.get_summary_stats(db, tahun_rkap)





@router.get("/invest-projects/{id_investasi:path}", response_model=list[schemas.ProjectResponse])
def get_projects_by_investment_id(
    id_investasi: str,
    db: Session = Depends(get_db)
):
    """
    Get all projects by Investment ID.
    
    - **id_investasi**: Investment ID
    """
    projects = crud.get_projects_by_investasi_id_list(db, id_investasi)
    return projects


@router.get("/{id_root:path}", response_model=schemas.ProjectResponse)
def get_project(
    id_root: str,
    db: Session = Depends(get_db)
):
    """
    Get a single project by ID.
    
    - **id_root**: Project UUID
    """
    project = crud.get_project(db, id_root)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=schemas.ProjectResponse, status_code=201)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new project.
    
    Required fields:
    - **id_investasi**: Unique investment ID
    - **project_definition**: Project description
    """
    # Check if id_investasi already exists
    existing = crud.get_project_by_investasi_id(db, project.id_investasi)
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Project with id_investasi '{project.id_investasi}' already exists"
        )
    
    return crud.create_project(db, project)


@router.put("/{id_root:path}", response_model=schemas.ProjectResponse)
def update_project(
    id_root: str,
    project: schemas.ProjectUpdate,
    db: Session = Depends(get_db)
):
    """
    Full update of a project.
    
    - **id_root**: Project UUID
    """
    updated = crud.update_project(db, id_root, project)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.patch("/{id_root:path}/progress", response_model=schemas.ProjectResponse)
def update_project_progress(
    id_root: str,
    progress: schemas.ProjectProgressUpdate,
    db: Session = Depends(get_db)
):
    """
    Update project progress fields.
    
    - **id_root**: Project UUID
    
    Allows updating:
    - progres_description
    - status_investasi
    - Monthly realization values
    """
    updated = crud.update_project_progress(db, id_root, progress)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.patch("/{id_root:path}/issue", response_model=schemas.ProjectResponse)
def update_project_issue(
    id_root: str,
    issue: schemas.ProjectIssueUpdate,
    db: Session = Depends(get_db)
):
    """
    Update project issue fields.
    
    - **id_root**: Project UUID
    
    Allows updating:
    - issue_categories
    - issue_description
    - action_target
    - head_office_support_desc
    - status_issue
    """
    updated = crud.update_project_issue(db, id_root, issue)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.delete("/{id_root:path}", status_code=204)
def delete_project(
    id_root: str,
    db: Session = Depends(get_db)
):
    """
    Delete a project.
    
    - **id_root**: Project UUID
    """
    deleted = crud.delete_project(db, id_root)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
