import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-6">
        <p className="text-sm text-emerald-400">CarbonGrid</p>
        <h1 className="text-5xl font-semibold tracking-tight">
          Geospatial sustainability intelligence.
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Analyze projects, carbon emissions, solar potential and sustainability opportunities.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg bg-white px-5 py-3 text-black font-medium"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
