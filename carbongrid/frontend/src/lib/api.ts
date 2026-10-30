import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://neogreen-7321.onrender.com";