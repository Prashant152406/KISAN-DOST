import api from "./api.js";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  verifyEmail: (payload) => api.post("/auth/verify-email", payload),
  resendOtp: (payload) => api.post("/auth/resend-otp", payload),
  login: (payload) => api.post("/auth/login", payload),
  google: (credential) => api.post("/auth/google", { credential }),
  logout: () => api.post("/auth/logout"),
  logoutAll: () => api.post("/auth/logout-all"),
  me: () => api.get("/auth/me"),
  getSessions: () => api.get("/auth/sessions"),
  revokeSession: (id) => api.delete(`/auth/sessions/${id}`),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  changePassword: (payload) => api.patch("/auth/change-password", payload),
};
