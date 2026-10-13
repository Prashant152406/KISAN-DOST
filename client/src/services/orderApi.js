import api from "./api.js";

export const orderApi = {
  paymentStatus: () => api.get("/orders/payment-status"),
  create: (payload) => api.post("/orders", payload),
  verifyPayment: (payload) => api.post("/orders/verify-payment", payload),
  listMine: (params = {}) => api.get("/orders", { params }),
  getMine: (id) => api.get(`/orders/${id}`),
  cancelMine: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),

  // Admin
  adminList: (params = {}) => api.get("/orders/admin/all", { params }),
  adminUpdateStatus: (id, payload) => api.patch(`/orders/admin/${id}/status`, payload),
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
};
