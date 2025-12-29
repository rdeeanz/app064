"""
FastAPI application entry point.
Project Management Investment Dashboard API.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import projects, auth, monitor
from .database import engine, Base, SQLITE_FALLBACK_URL
from .models import ProjectInvest, TypeInvestasi, StatusIssue


def seed_sample_data():
    """Insert sample data if database is empty."""
    from .database import SessionLocal
    db = SessionLocal()
    try:
        # Only seed if no data exists
        if db.query(ProjectInvest).count() == 0:
            sample_projects = [
                ProjectInvest(
                    entitas_terminal="Terminal Tanjung Priok",
                    id_investasi="INV-2025-001",
                    asset_categories="Infrastructure",
                    type_investasi=TypeInvestasi.MURNI,
                    tahun_usulan=2024,
                    project_definition="Pengembangan Terminal Container",
                    status_investasi="In Progress",
                    progres_description="Pembangunan tahap 1",
                    pic="John Doe",
                    tahun_rkap=2025,
                    kebutuhan_dana=5000000000,
                    rkap=4500000000,
                    rkap_januari=400000000,
                    rkap_februari=350000000,
                    realisasi_januari=380000000,
                    nilai_kontrak=4200000000,
                ),
                ProjectInvest(
                    entitas_terminal="Terminal Merak",
                    id_investasi="INV-2025-002",
                    asset_categories="Equipment",
                    type_investasi=TypeInvestasi.MULTI_YEAR,
                    tahun_usulan=2023,
                    project_definition="Pengadaan Crane Container",
                    status_investasi="Approved",
                    progres_description="Proses tender",
                    issue_categories="Technical",
                    issue_description="Waiting for vendor approval",
                    pic="Jane Smith",
                    tahun_rkap=2025,
                    kebutuhan_dana=3000000000,
                    rkap=2800000000,
                    rkap_januari=250000000,
                    nilai_kontrak=2700000000,
                ),
                ProjectInvest(
                    entitas_terminal="Terminal Panjang",
                    id_investasi="INV-2025-003",
                    asset_categories="IT System",
                    type_investasi=TypeInvestasi.CARRY_FORWARD,
                    tahun_usulan=2022,
                    project_definition="Sistem Manajemen Pelabuhan",
                    status_investasi="Completed",
                    progres_description="100% selesai",
                    pic="Bob Wilson",
                    tahun_rkap=2025,
                    kebutuhan_dana=1500000000,
                    rkap=1500000000,
                    nilai_kontrak=1450000000,
                    status_issue=StatusIssue.CLOSED,
                ),
            ]
            db.add_all(sample_projects)
            db.commit()
            print(f"Seeded {len(sample_projects)} sample projects")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown."""
    # Startup: Create tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created")
    
    # Seed sample data for SQLite development mode
    try:
        seed_sample_data()
    except Exception as e:
        print(f"Warning: Could not seed sample data: {e}")
    
    yield
    # Shutdown: cleanup if needed


# Create FastAPI application
app = FastAPI(
    title="Project Investment Management API",
    description="API for managing investment project data with RKAP tracking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for internal system
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router)
app.include_router(auth.router)
app.include_router(monitor.router)


@app.get("/health")
def health_check():
    """Health check endpoint for container orchestration."""
    return {"status": "healthy", "service": "project-invest-api"}


@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "name": "Project Investment Management API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

