"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const DynamicMap = dynamic(() => import("@/components/maps/ProjectMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-400">
      Loading Satellite Imagery Map...
    </div>
  ),
});

export default function SatelliteAnalysisPage() {
  const [lat, setLat] = useState("37.7749");
  const [lng, setLng] = useState("-122.4194");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>({
    areaHa: 176.3,
    greenCoverage: 21.9,
    builtCoverage: 78.1,
    co2Absorption: 849.2,
    co2Emissions: 6883.1,
    netBalance: -6033.9,
    ndgiIndex: 0.22,
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/satellite/analyze", {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });

      setAnalysisResult(response.data);
    } catch (err: any) {
      setError("Failed to run satellite analysis. Check backend connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Geospatial Satellite Analysis</h1>
          <p className="text-sm text-slate-400">
            AI-powered satellite vegetation detection, green cover index (NDGI) & carbon sink calculations
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h2 className="text-base font-semibold text-emerald-400">Location Coordinates</h2>
              <form onSubmit={handleAnalyze} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300">Latitude</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300">Longitude</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={analyzing}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {analyzing ? "Running Live Scan..." : "Analyze Satellite Zone"}
                </button>
              </form>
            </div>

            {analysisResult && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <h2 className="text-base font-semibold text-white">EIA Land Use Metrics</h2>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Green Vegetation Zone:</span>
                    <span className="font-bold text-emerald-400">{analysisResult.greenCoverage}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Built / Non-Green Zone:</span>
                    <span className="font-bold text-slate-300">{analysisResult.builtCoverage}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">CO₂ Absorption Capacity:</span>
                    <span className="font-bold text-emerald-400">{analysisResult.co2Absorption} t/yr</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Estimated Area Emissions:</span>
                    <span className="font-bold text-red-400">{analysisResult.co2Emissions} t/yr</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-300 font-semibold">Net Carbon Balance:</span>
                    <span className="font-bold text-amber-400">{analysisResult.netBalance} t/yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-4 min-h-[480px]">
            <DynamicMap lat={parseFloat(lat)} lng={parseFloat(lng)} />
          </div>
        </div>
      </div>
    </div>
  );
}