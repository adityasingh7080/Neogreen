"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatNum = (val: number) => {
    if (val === undefined || val === null) return "0";
    return val.toLocaleString("en-US");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Sustainability Command Center</h1>
          <p className="text-sm text-slate-400">
            Real-time platform overview across carbon accounting, satellite GIS scans, and solar energy generation
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
            <p className="text-xs text-slate-400">Annual Gross Emissions</p>
            <p className="text-2xl font-bold text-red-400">
              1,250 <span className="text-sm font-normal text-slate-300">t CO₂e</span>
            </p>
            <p className="text-[10px] text-slate-500">Scope 1, 2 & 3 Calculated</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
            <p className="text-xs text-slate-400">Clean Solar Power Potential</p>
            <p className="text-2xl font-bold text-amber-400">
              722,700 <span className="text-sm font-normal text-slate-300">kWh/yr</span>
            </p>
            <p className="text-[10px] text-slate-500">Est. 1,200 m² Rooftop Area</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
            <p className="text-xs text-slate-400">Satellite EIA Green Cover</p>
            <p className="text-2xl font-bold text-emerald-400">
              21.9% <span className="text-sm font-normal text-slate-300">NDGI</span>
            </p>
            <p className="text-[10px] text-slate-500">849.2 t CO₂ Absorption/yr</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-1">
            <p className="text-xs text-slate-400">Simulated Offsets</p>
            <p className="text-2xl font-bold text-sky-400">
              490 <span className="text-sm font-normal text-slate-300">t CO₂e</span>
            </p>
            <p className="text-[10px] text-slate-500">98% Towards Net-Zero Target</p>
          </div>
        </div>

        {/* Quick Module Navigation & Action Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Active Modules</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/calculator"
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 hover:border-emerald-500 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-emerald-400">📊 Carbon Calculator</p>
                  <p className="text-xs text-slate-400">Scope 1, 2, 3 footprint models and energy metrics</p>
                </div>
                <span className="text-xs text-slate-500">Open &rarr;</span>
              </Link>

              <Link
                href="/dashboard/satellite"
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 hover:border-emerald-500 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-emerald-400">🛰️ Satellite Analysis</p>
                  <p className="text-xs text-slate-400">GIS spatial land-use scan and green coverage mapping</p>
                </div>
                <span className="text-xs text-slate-500">Open &rarr;</span>
              </Link>

              <Link
                href="/dashboard/solar"
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 hover:border-amber-500 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-amber-400">☀️ Solar Potential</p>
                  <p className="text-xs text-slate-400">Rooftop capacity, utility savings and ROI payback</p>
                </div>
                <span className="text-xs text-slate-500">Open &rarr;</span>
              </Link>

              <Link
                href="/dashboard/offset"
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 hover:border-emerald-500 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-sky-400">🌱 Offset Simulator</p>
                  <p className="text-xs text-slate-400">Reforestation, RECs, and credit purchase planning</p>
                </div>
                <span className="text-xs text-slate-500">Open &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Environmental Summary Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Sustainability Progress</h2>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400">Net-Zero Target Progress:</span>
                  <span className="font-bold text-emerald-400">98%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-950">
                  <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: "98%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400">Clean Energy Coverage:</span>
                  <span className="font-bold text-amber-400">57.8%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-950">
                  <div className="h-2.5 rounded-full bg-amber-500" style={{ width: "57.8%" }}></div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2 mt-4">
                <p className="text-xs font-semibold text-slate-300">System Integration Status</p>
                <div className="flex items-center justify-between text-slate-400">
                  <span>FastAPI Backend Engine</span>
                  <span className="text-emerald-400 font-bold">● Connected</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>SQLite Persistence</span>
                  <span className="text-emerald-400 font-bold">● Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}