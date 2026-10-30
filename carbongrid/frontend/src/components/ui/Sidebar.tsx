
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Carbon Calculator", path: "/dashboard/calculator", icon: "📊" },
  { name: "Satellite Analysis", path: "/dashboard/satellite", icon: "🛰️" },
  { name: "Solar Potential", path: "/dashboard/solar", icon: "☀️" },
  { name: "Offset Simulator", path: "/dashboard/offset", icon: "🌱" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold text-emerald-400">CarbonGrid</h2>
          <p className="text-xs text-slate-400">Sustainability Intelligence</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800 text-xs text-slate-500">
        v1.0.0 &bull; Local Environment
      </div>
    </aside>
  );
}