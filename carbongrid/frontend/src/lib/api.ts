import axios from "axios";

// Primary API base URL pointing to Render backend
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  "https://neogreen-7321.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL.endsWith("/api/v1") 
    ? API_BASE_URL 
    : `${API_BASE_URL.replace(/\/$/, "")}/api/v1`,
  headers: { "Content-Type": "application/json" },
});