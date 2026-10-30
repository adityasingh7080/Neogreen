"use client";

import { useState, useEffect } from "react";

export default function OffsetSimulatorPage() {
  const [emissions, setEmissions] = useState("500");
  const [trees, setTrees] = useState("2000");
  const [rec, setRec] = useState("300");
  const [credits, setCredits] = useState("200");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");
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

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const numEmissions = Number(emissions) || 0;
      const numTrees = Number(trees) || 0;
      const numRec = Number(rec) || 0;
      const numCredits = Number(credits) || 0;

      // Offsetting factors:
      // ~22kg (0.022 t) CO2 absorbed per tree/year
      // ~0.82 t CO2 offset per MWh REC
      // 1 t CO2 offset per direct carbon credit
      const reforestation_offset = Math.round(numTrees * 0.022);
      const rec_offset = Math.round(numRec * 0.82);
      const credit_offset = Math.round(numCredits * 1.0);

      const total_offset = reforestation_offset + rec_offset + credit_offset;
      const net_remaining_emissions = Math.max(0, numEmissions - total_offset);
      const offset_percentage = numEmissions > 0 
        ? Math.min(100, Math.round((total_offset / numEmissions) * 100))
        : 100;

      // Cost Factors: $15/tree, $25/MWh REC, $30/Carbon Credit
      const total_cost = (numTrees * 15) + (numRec * 25) + (numCredits * 30);

      setResult({
        current_emissions: numEmissions,
        reforestation_offset,
        rec_offset,
        credit_offset,
        total_offset,
        net_remaining_emissions,
        offset_percentage,
        total_cost,
      });
    } catch (err: any) {
      setError("Failed to process simulation.");
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
            
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

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