"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function CalculatorPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  // Video Form Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Activity Data Inputs
  const [electricity, setElectricity] = useState(25000);
  const [diesel, setDiesel] = useState(500);
  const [vehicleKm, setVehicleKm] = useState(12000);
  const [flightHours, setFlightHours] = useState(15);
  const [commuteKm, setCommuteKm] = useState(5000);
  const [wasteKg, setWasteKg] = useState(800);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Dynamic API fetch target
      const res = await fetch("https://neogreen-7321.onrender.com/api/v1/calculator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electricity_kwh: Number(electricity),
          diesel_liters: Number(diesel),
          vehicle_km: Number(vehicleKm),
          flight_hours: Number(flightHours),
          employee_commute_km: Number(commuteKm),
          waste_kg: Number(wasteKg),
        }),
      });

      if (!res.ok) {
        throw new Error("Calculation request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError("Failed to calculate footprint. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Carbon Footprint Calculator</h1>
            <p className="text-sm text-slate-400">
              Calculate and visualize Scope 1, Scope 2 & Scope 3 GHG Emissions
            </p>
          </div>

          {/* Trigger to open the Video Form Modal */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            Open Video Form
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-emerald-400">Activity Data</h2>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <p className="text-xs font-semibold text-slate-400 mb-2">Scope 1 & 2 Emissions</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300">Monthly Grid Electricity (kWh)</label>
                    <input
                      type="number"
                      required
                      value={electricity}
                      onChange={(e) => setElectricity(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300">Diesel Generator Usage (Liters)</label>
                    <input
                      type="number"
                      required
                      value={diesel}
                      onChange={(e) => setDiesel(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "Computing..." : "Calculate Footprint"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Video Form Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-semibold text-white">Video Submission Form</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Embed Video Player / Video Submission Interface */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Video Form"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowVideoModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs text-slate-300">Video Notes / Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  rows={3}
                  placeholder="Enter details regarding this video submission..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                Submit Video Response
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}