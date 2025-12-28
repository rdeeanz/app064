"""
Database connection and session management for FastAPI application.
Uses SQLAlchemy with PostgreSQL, with SQLite fallback for development.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL from environment variable
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/project_invest"
)

# SQLite fallback for development without PostgreSQL
SQLITE_FALLBACK_URL = "sqlite:///./project_invest_dev.db"

# Try to connect to PostgreSQL, fall back to SQLite if unavailable
def get_engine():
    """Create database engine with fallback to SQLite."""
    try:
        engine = create_engine(DATABASE_URL)
        # Test connection
        with engine.connect() as conn:
            pass
        print(f"Connected to PostgreSQL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else DATABASE_URL}")
        return engine
    except Exception as e:
        print(f"PostgreSQL unavailable ({e}), using SQLite fallback")
        # SQLite requires check_same_thread=False for FastAPI
        engine = create_engine(
            SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return engine

# Create SQLAlchemy engine
engine = get_engine()

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session.
    Ensures session is properly closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

