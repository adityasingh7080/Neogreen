# CarbonGrid

Full-stack geospatial sustainability and carbon intelligence platform.

## Stack

- Next.js 14 + TypeScript + Tailwind + shadcn/ui
- FastAPI + SQLAlchemy + Alembic
- PostgreSQL + PostGIS
- Python geospatial/AI service
- GeoPandas / Rasterio / OpenCV / Google Earth Engine-ready architecture

## Run

1. Copy `.env.example` to `.env`
2. Run `docker compose up --build`
3. Frontend: http://localhost:3000
4. Backend: http://localhost:8000
5. API docs: http://localhost:8000/docs
6. AI service: http://localhost:8001/health
