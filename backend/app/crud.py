"""
CRUD operations for project investment data.
Provides database operations with proper error handling.
"""
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas


def get_projects(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    klaster_regional: Optional[str] = None,
    tahun_rkap: Optional[int] = None,
    status_issue: Optional[str] = None
) -> tuple[list[models.ProjectInvest], int]:
    """
    Get list of projects with optional filtering and pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip (offset)
        limit: Maximum number of records to return
        klaster_regional: Filter by regional cluster
        tahun_rkap: Filter by RKAP year
        status_issue: Filter by issue status
    
    Returns:
        Tuple of (projects list, total count)
    """
    query = db.query(models.ProjectInvest)
    
    # Apply filters
    if klaster_regional:
        query = query.filter(models.ProjectInvest.klaster_regional == klaster_regional)
    if tahun_rkap:
        query = query.filter(models.ProjectInvest.tahun_rkap == tahun_rkap)
    if status_issue:
        query = query.filter(models.ProjectInvest.status_issue == status_issue)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination and ordering
    projects = query.order_by(models.ProjectInvest.created_at.desc())\
                   .offset(skip)\
                   .limit(limit)\
                   .all()
    
    return projects, total


def get_project(db: Session, id_root: UUID) -> Optional[models.ProjectInvest]:
    """
    Get a single project by its ID.
    
    Args:
        db: Database session
        id_root: Project UUID
    
    Returns:
        Project if found, None otherwise
    """
    return db.query(models.ProjectInvest)\
             .filter(models.ProjectInvest.id_root == id_root)\
             .first()


def get_project_by_investasi_id(db: Session, id_investasi: str) -> Optional[models.ProjectInvest]:
    """
    Get a project by its investment ID.
    
    Args:
        db: Database session
        id_investasi: Investment ID string
    
    Returns:
        Project if found, None otherwise
    """
    return db.query(models.ProjectInvest)\
             .filter(models.ProjectInvest.id_investasi == id_investasi)\
             .first()


def create_project(db: Session, project: schemas.ProjectCreate) -> models.ProjectInvest:
    """
    Create a new project.
    
    Args:
        db: Database session
        project: Project data
    
    Returns:
        Created project
    """
    db_project = models.ProjectInvest(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(
    db: Session,
    id_root: UUID,
    project: schemas.ProjectUpdate
) -> Optional[models.ProjectInvest]:
    """
    Full update of a project.
    
    Args:
        db: Database session
        id_root: Project UUID
        project: Updated project data
    
    Returns:
        Updated project if found, None otherwise
    """
    db_project = get_project(db, id_root)
    if not db_project:
        return None
    
    # Update only provided fields
    update_data = project.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project_progress(
    db: Session,
    id_root: UUID,
    progress: schemas.ProjectProgressUpdate
) -> Optional[models.ProjectInvest]:
    """
    Update project progress fields only.
    
    Args:
        db: Database session
        id_root: Project UUID
        progress: Progress update data
    
    Returns:
        Updated project if found, None otherwise
    """
    db_project = get_project(db, id_root)
    if not db_project:
        return None
    
    update_data = progress.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project_issue(
    db: Session,
    id_root: UUID,
    issue: schemas.ProjectIssueUpdate
) -> Optional[models.ProjectInvest]:
    """
    Update project issue fields only.
    
    Args:
        db: Database session
        id_root: Project UUID
        issue: Issue update data
    
    Returns:
        Updated project if found, None otherwise
    """
    db_project = get_project(db, id_root)
    if not db_project:
        return None
    
    update_data = issue.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, id_root: UUID) -> bool:
    """
    Delete a project by ID.
    
    Args:
        db: Database session
        id_root: Project UUID
    
    Returns:
        True if deleted, False if not found
    """
    db_project = get_project(db, id_root)
    if not db_project:
        return False
    
    db.delete(db_project)
    db.commit()
    return True


def get_summary_stats(db: Session, tahun_rkap: Optional[int] = None) -> dict:
    """
    Get summary statistics for dashboard.
    
    Args:
        db: Database session
        tahun_rkap: Optional filter by RKAP year
    
    Returns:
        Dictionary with summary statistics
    """
    query = db.query(models.ProjectInvest)
    
    if tahun_rkap:
        query = query.filter(models.ProjectInvest.tahun_rkap == tahun_rkap)
    
    total_projects = query.count()
    total_rkap = db.query(func.sum(models.ProjectInvest.rkap)).scalar() or 0
    total_nilai_kontrak = db.query(func.sum(models.ProjectInvest.nilai_kontrak)).scalar() or 0
    
    open_issues = query.filter(
        models.ProjectInvest.status_issue == models.StatusIssue.OPEN
    ).count()
    
    return {
        "total_projects": total_projects,
        "total_rkap": float(total_rkap),
        "total_nilai_kontrak": float(total_nilai_kontrak),
        "open_issues": open_issues
    }
