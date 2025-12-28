# Project Investment Management System

Sistem dashboard untuk mengelola data proyek investasi secara terpusat dengan fokus pada stabilitas, integritas data keuangan, dan kemudahan operasional.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + shadcn/ui |
| Backend | FastAPI + SQLAlchemy |
| Database | PostgreSQL 15 |
| Dashboard | Grafana 10 |
| Deployment | Docker + Docker Compose |

## Quick Start

### Prerequisites
- Docker
- Docker Compose

### Running the System

1. **Clone dan masuk ke direktori project:**
   ```bash
   cd app064
   ```

2. **Jalankan semua services:**
   ```bash
   docker compose up -d
   ```

3. **Akses aplikasi:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Grafana: http://localhost:3001 (admin/admin)

### Stopping the System

```bash
docker compose down
```

### Reset Database

```bash
docker compose down -v
docker compose up -d
```

## Project Structure

```
app064/
├── docker-compose.yml      # Docker orchestration
├── .env                    # Environment variables
├── database/
│   └── init.sql            # PostgreSQL schema & seed data
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py         # FastAPI entrypoint
│       ├── database.py     # SQLAlchemy config
│       ├── models.py       # ORM models
│       ├── schemas.py      # Pydantic schemas
│       ├── crud.py         # Database operations
│       └── routers/
│           └── projects.py # API endpoints
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── lib/
│       │   ├── api.js      # API service
│       │   └── utils.js    # Utilities
│       ├── components/ui/  # shadcn/ui components
│       └── pages/
│           ├── ProjectList.jsx
│           ├── ProjectDetail.jsx
│           └── ProjectForm.jsx
└── grafana/
    ├── provisioning/
    │   ├── datasources/
    │   └── dashboards/
    └── dashboards/
        └── project-dashboard.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects (paginated) |
| GET | `/projects/{id}` | Get single project |
| POST | `/projects` | Create project |
| PUT | `/projects/{id}` | Update project |
| PATCH | `/projects/{id}/progress` | Update progress |
| PATCH | `/projects/{id}/issue` | Update issue |
| DELETE | `/projects/{id}` | Delete project |
| GET | `/projects/stats` | Get summary statistics |

### Query Parameters

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)
- `klaster_regional`: Filter by regional cluster
- `tahun_rkap`: Filter by RKAP year
- `status_issue`: Filter by issue status (Open/Closed)

## Grafana Dashboard

Dashboard menyediakan visualisasi:
- **KPI Cards**: Total RKAP, Nilai Kontrak, Projects, Open Issues
- **RKAP vs Realisasi**: Bar chart bulanan
- **Status Distribution**: Pie charts untuk issue dan type investasi
- **Project Tables**: Recent projects dan open issues
- **Regional Analysis**: RKAP per klaster regional

## Development

### Running Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

### Running Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=project_invest
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
```

## Data Schema

### project_invest Table

| Field | Type | Description |
|-------|------|-------------|
| id_root | UUID | Primary key |
| id_investasi | VARCHAR | Investment ID (unique) |
| klaster_regional | VARCHAR | Regional cluster |
| entitas_terminal | VARCHAR | Terminal entity |
| type_investasi | ENUM | Murni/Multi Year/Carry Forward |
| rkap | NUMERIC | RKAP value |
| nilai_kontrak | NUMERIC | Contract value |
| status_issue | ENUM | Open/Closed |
| ... | ... | See init.sql for full schema |

## License

Internal Use Only