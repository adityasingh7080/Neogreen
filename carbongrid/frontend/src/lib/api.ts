
import axios from "axios";

export const api = axios.create({
  baseURL: "https://neogreen-7321.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});