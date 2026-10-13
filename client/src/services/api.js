import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends/receives the HTTP-only session cookie
  headers: { "Content-Type": "application/json" },
});

// Normalize errors so components can just read err.message / err.code
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error.response?.data;
    const normalized = {
      message: payload?.message || "Something went wrong. Please try again.",
      code: payload?.code || "UNKNOWN_ERROR",
      errors: payload?.errors || [],
      statusCode: error.response?.status,
    };
    return Promise.reject(normalized);
  }
);

export default api;
