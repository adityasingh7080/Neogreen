import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      electricity_kwh = 0,
      diesel_liters = 0,
      vehicle_km = 0,
      flight_hours = 0,
      employee_commute_km = 0,
      waste_kg = 0,
    } = body;

    // GHG Protocol standard calculation factors
    const scope1_kg = diesel_liters * 2.68 + vehicle_km * 0.21;
    const scope2_kg = electricity_kwh * 0.85;
    const scope3_kg = flight_hours * 90 + employee_commute_km * 0.17 + waste_kg * 0.5;

    const total_tonnes = (scope1_kg + scope2_kg + scope3_kg) / 1000;

    return NextResponse.json({
      status: "success",
      total_emissions_tonnes: Number(total_tonnes.toFixed(2)),
      breakdown: {
        scope1_tonnes: Number((scope1_kg / 1000).toFixed(2)),
        scope2_tonnes: Number((scope2_kg / 1000).toFixed(2)),
        scope3_tonnes: Number((scope3_kg / 1000).toFixed(2)),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid calculation request payload" },
      { status: 400 }
    );
  }
}