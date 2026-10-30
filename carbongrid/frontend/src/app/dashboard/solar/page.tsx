"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function SolarCalculatorPage() {
  const [area, setArea] = useState("1200");
  const [efficiency, setEfficiency] = useState("20");
  const [sunHours, setSunHours] = useState("5.5");
  const [costPerKwh, setCostPerKwh] = useState("0.12");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [result, setResult] = useState<any>({
    annual_generation_kwh: 722700,
    annual_co2_offset_tons: 592.61,
    annual_cost_savings: 86724,
    estimated_setup_cost: 144000,
    payback_years: 1.7,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/solar/calculate", {
        rooftop_area_sqm: parseFloat(area),
        panel_efficiency_percent: parseFloat(efficiency),
        average_sunshine_hours_per_day: parseFloat(sunHours),
        electricity_cost_per_kwh: parseFloat(costPerKwh),
      });

      setResult(response.data);
    } catch (err) {
      console.error("Solar calculation error", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
    return num.toLocaleString("en-US");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus Solar Potential Calculator</h1>
          <p className="text-sm text-slate-400">
            Estimate rooftop photovoltaic capacity, clean power generation, carbon offset & financial ROI
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <h2 className="text-base font-semibold text-amber-400">Rooftop & Solar Parameters</h2>
            <form onSubmit={handleCalculate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300">Usable Rooftop Area (m²)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300">Panel Efficiency (%)</label>
                <input
                  type="number"
                  value={efficiency}
                  onChange={(e) => setEfficiency(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300">Avg Sunshine Hours / Day</label>
                <input
                  type="number"
                  step="0.1"
                  value={sunHours}
                  onChange={(e) => setSunHours(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300">Electricity Tariff Rate ($ / kWh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPerKwh}
                  onChange={(e) => setCostPerKwh(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
              >
                {loading ? "Calculating Solar Potential..." : "Calculate Potential"}
              </button>
            </form>
          </div>

          {result && (
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Annual Solar Power Generation</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatNumber(result.annual_generation_kwh)} <span className="text-sm font-normal text-slate-300">kWh/yr</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Annual CO₂ Reduction Offset</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatNumber(result.annual_co2_offset_tons)} <span className="text-sm font-normal text-slate-300">t CO₂e/yr</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Estimated Annual Utility Savings</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${formatNumber(result.annual_cost_savings)} <span className="text-sm font-normal text-slate-300">/yr</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Est. Payback Period</p>
                  <p className="text-2xl font-bold text-sky-400">
                    {result.payback_years} <span className="text-sm font-normal text-slate-300">Years</span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white">System Investment Summary</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Estimated Turnkey Installation Cost:</span>
                    <span className="font-bold text-white">${formatNumber(result.estimated_setup_cost)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">25-Year Cumulative Clean Energy Savings:</span>
                    <span className="font-bold text-emerald-400">
                      ${formatNumber((result.annual_cost_savings || 0) * 25)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}