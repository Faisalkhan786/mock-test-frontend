import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config";

// One axios instance for the whole app. Every request auto-attaches the JWT
// (agar login hua hai) — stateless backend isse pehchaan leta hai.
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  // ngrok free tier warna ek HTML warning page bhejta hai — ye header usse skip karta hai.
  headers: { "ngrok-skip-browser-warning": "true" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Backend errors ko ek saaf message me badlo (screens me dikhane ke liye).
export function apiError(e: any): string {
  return e?.response?.data?.error || e?.message || "Network error";
}
