"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/api/v1/auth/login`,
        formData
      );

      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div>
          <h2 className="text-2xl font-bold text-emerald-400">CarbonGrid</h2>
          <p className="text-xs text-slate-400">Sign in to your sustainability platform account</p>
        </div>

        {error && <div className="rounded bg-red-900/50 p-3 text-xs text-red-300 border border-red-700">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="admin@carbongrid.io"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-600 p-2.5 font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}