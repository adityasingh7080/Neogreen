import axios from "axios";

// Hardcode Render URL as primary/fallback so client code never hits 127.0.0.1
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://neogreen-7321.onrender.com";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});