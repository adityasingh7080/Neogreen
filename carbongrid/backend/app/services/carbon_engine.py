from typing import Dict, Tuple


def calculate_carbon_footprint(
    electricity_kwh: float,
    diesel_liters: float,
    vehicle_km: float,
) -> Tuple[float, float, float, Dict[str, float]]:
    """
    Standard Carbon Accounting Engine following IPCC / CEA national factors.
    - Grid Electricity: ~0.82 kg CO2e / kWh
    - Diesel Generator: ~2.68 kg CO2e / Liter
    - Fleet Vehicle (Avg Petrol/Diesel mix): ~0.17 kg CO2e / km
    """
    scope_1_diesel = diesel_liters * 2.68
    scope_1_vehicles = vehicle_km * 0.17
    scope_1_total = scope_1_diesel + scope_1_vehicles

    scope_2_total = electricity_kwh * 0.82

    total_co2e = scope_1_total + scope_2_total

    breakdown = {
        "electricity": round(scope_2_total, 2),
        "diesel_generators": round(scope_1_diesel, 2),
        "vehicles": round(scope_1_vehicles, 2),
    }

    return (
        round(scope_1_total, 2),
        round(scope_2_total, 2),
        round(total_co2e, 2),
        breakdown,
    )