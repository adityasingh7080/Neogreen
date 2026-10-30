"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
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
      // Calls the Render API dynamically using api client setup
      const response = await api.post("/calculator/calculate", {
        electricity_kwh: Number(electricity),
        diesel_liters: Number(diesel),
        vehicle_km: Number(vehicleKm),
        flight_hours: Number(flightHours),
        employee_commute_km: Number(commuteKm),
        waste_kg: Number(wasteKg),
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to calculate footprint. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!result) return;

    const csvRows = [
      ["Category", "Emission (kg CO2e)"],
      ["Total Emissions", result.total_co2e],
      ["Scope 1", result.scope_1_co2e],
      ["Scope 2", result.scope_2_co2e],
      ["Scope 3", result.scope_3_co2e],
      ["Electricity (Scope 2)", result.breakdown?.electricity],
      ["Diesel Generators (Scope 1)", result.breakdown?.diesel_generators],
      ["Fleet Vehicles (Scope 1)", result.breakdown?.vehicles],
      ["Business Flights (Scope 3)", result.breakdown?.flights],
      ["Employee Commute (Scope 3)", result.breakdown?.commute],
      ["Waste (Scope 3)", result.breakdown?.waste],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "carbon_footprint_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
        logging: false,
        onclone: (clonedDoc) => {
          const svgElements = clonedDoc.querySelectorAll("svg");
          svgElements.forEach((svg) => {
            svg.setAttribute("width", svg.getBoundingClientRect().width.toString());
            svg.setAttribute("height", svg.getBoundingClientRect().height.toString());
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("carbon_footprint_summary.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const scopePieData = result
    ? [
        { name: "Scope 1 (Direct)", value: result.scope_1_co2e, color: "#10b981" },
        { name: "Scope 2 (Indirect)", value: result.scope_2_co2e, color: "#3b82f6" },
        { name: "Scope 3 (Value Chain)", value: result.scope_3_co2e, color: "#14b8a6" },
      ]
    : [];

  const breakdownBarData = result
    ? [
        { category: "Electricity", emissions: result.breakdown?.electricity },
        { category: "Diesel Gen", emissions: result.breakdown?.diesel_generators },
        { category: "Vehicles", emissions: result.breakdown?.vehicles },
        { category: "Flights", emissions: result.breakdown?.flights },
        { category: "Commute", emissions: result.breakdown?.commute },
        { category: "Waste", emissions: result.breakdown?.waste },
      ]
    : [];

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

          {result && (
            <div className="flex space-x-3">
              <button
                onClick={exportCSV}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                Export CSV
              </button>
              <button
                onClick={exportPDF}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
              >
                Download PDF
              </button>
            </div>
          )}
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
                  <div>
                    <label className="block text-xs text-slate-300">Fleet Vehicle Travel (Km / Month)</label>
                    <input
                      type="number"
                      required
                      value={vehicleKm}
                      onChange={(e) => setVehicleKm(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-teal-400 mb-2">Scope 3 Emissions (Value Chain)</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300">Business Air Travel (Hours / Month)</label>
                    <input
                      type="number"
                      required
                      value={flightHours}
                      onChange={(e) => setFlightHours(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300">Employee Commuting (Total Km / Month)</label>
                    <input
                      type="number"
                      required
                      value={commuteKm}
                      onChange={(e) => setCommuteKm(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300">Landfill Waste Generated (Kg / Month)</label>
                    <input
                      type="number"
                      required
                      value={wasteKg}
                      onChange={(e) => setWasteKg(Number(e.target.value))}
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

          {/* Results Panel with Chart Capture */}
          <div ref={reportRef} className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Footprint Analysis & Visuals</h2>
              {result ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="text-xs text-emerald-300">Total Emissions</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {result.total_co2e} <span className="text-base font-normal">kg CO₂e</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <p className="text-xs text-slate-400">Scope 1</p>
                      <p className="text-base font-bold text-emerald-400">{result.scope_1_co2e} kg</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <p className="text-xs text-slate-400">Scope 2</p>
                      <p className="text-base font-bold text-blue-400">{result.scope_2_co2e} kg</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <p className="text-xs text-slate-400">Scope 3</p>
                      <p className="text-base font-bold text-teal-400">{result.scope_3_co2e} kg</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-semibold text-slate-300 mb-2">Scope Distribution</p>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={scopePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={65}
                            innerRadius={35}
                            paddingAngle={5}
                          >
                            {scopePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff" }}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-semibold text-slate-300 mb-2">Emissions Breakdown (kg CO₂e)</p>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={breakdownBarData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff" }}
                          />
                          <Bar dataKey="emissions" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-8 text-center text-sm text-slate-500">
                  Enter activity values and submit to view emissions charts and export reports.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}