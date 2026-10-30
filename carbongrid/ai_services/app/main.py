from fastapi import FastAPI

app = FastAPI(title="CarbonGrid AI Services", version="0.1.0")

@app.get("/health")
def health():
    return {"status": "ok", "service": "carbongrid-ai"}

@app.get("/api/v1/geospatial/mock")
def mock_geospatial():
    return {
        "provider": "mock",
        "built_up_area_m2": 10000,
        "vegetation_area_m2": 5000,
        "open_area_m2": 3000,
        "water_area_m2": 500,
    }
