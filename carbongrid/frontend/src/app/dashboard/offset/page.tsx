"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function OffsetSimulatorPage() {
  const [emissions, setEmissions] = useState("500");
  const [trees, setTrees] = useState("2000");
  const [rec, setRec] = useState("300");
  const [credits, setCredits] = useState("200");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [result, setResult] = useState<any>({
    current_emissions: 500,
    reforestation_offset: 44,
    rec_offset: 246,
    credit_offset: 200,
    total_offset: 490,
    net_remaining_emissions: 10,
    offset_percentage: 98,
    total_cost: 43500,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // GHG Protocol standard calculation factors
    const scope1_kg = Number(diesel) * 2.68 + Number(vehicleKm) * 0.21;
    const scope2_kg = Number(electricity) * 0.85;
    const scope3_kg = Number(flightHours) * 90 + Number(commuteKm) * 0.17 + Number(wasteKg) * 0.5;

    const total_tonnes = (scope1_kg + scope2_kg + scope3_kg) / 1000;

    setResult({
      status: "success",
      total_emissions_tonnes: Number(total_tonnes.toFixed(2)),
      breakdown: {
        scope1_tonnes: Number((scope1_kg / 1000).toFixed(2)),
        scope2_tonnes: Number((scope2_kg / 1000).toFixed(2)),
        scope3_tonnes: Number((scope3_kg / 1000).toFixed(2)),
      },
    });
  } catch (err: any) {
    setError("Failed to process calculation.");
  } finally {
    setLoading(false);
  }
};

  const formatNum = (val: number) => {
    if (val === undefined || val === null) return "0";
    return val.toLocaleString("en-US");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Carbon Offsetting & Neutrality Simulator</h1>
          <p className="text-sm text-slate-400">
            Simulate net-zero goals with tree planting, Renewable Energy Certificates (RECs) and verified carbon credits
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <h2 className="text-base font-semibold text-emerald-400">Strategy Inputs</h2>
            <form onSubmit={handleSimulate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300">Target Annual Emissions (t CO₂e)</label>
                <input
                  type="number"
                  value={emissions}
                  onChange={(e) => setEmissions(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300">Trees Planted ($15/tree)</label>
                <input
                  type="number"
                  value={trees}
                  onChange={(e) => setTrees(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300">RECs Purchased in MWh ($25/MWh)</label>
                <input
                  type="number"
                  value={rec}
                  onChange={(e) => setRec(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300">Carbon Credits ($30/ton)</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "Simulating..." : "Run Offsetting Simulation"}
              </button>
            </form>
          </div>

          {result && (
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Total Simulated Offset</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatNum(result.total_offset)} <span className="text-sm font-normal text-slate-300">t CO₂e</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Net Neutrality Achieved</p>
                  <p className="text-2xl font-bold text-sky-400">
                    {result.offset_percentage}%
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Remaining Un-offset Footprint</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatNum(result.net_remaining_emissions)} <span className="text-sm font-normal text-slate-300">t CO₂e</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
                  <p className="text-xs text-slate-400">Est. Total Strategy Cost</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${formatNum(result.total_cost)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white">Offset Vector Breakdown</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Tree Planting (Reforestation):</span>
                    <span className="font-bold text-emerald-400">{formatNum(result.reforestation_offset)} t CO₂e</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Renewable Energy Certificates (RECs):</span>
                    <span className="font-bold text-sky-400">{formatNum(result.rec_offset)} t CO₂e</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Direct Verified Carbon Credits:</span>
                    <span className="font-bold text-amber-400">{formatNum(result.credit_offset)} t CO₂e</span>
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