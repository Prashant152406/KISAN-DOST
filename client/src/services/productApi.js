import api from "./api.js";

export const productApi = {
  list: (params = {}) => api.get("/products", { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),

  // Admin/seller
  adminList: (params = {}) => api.get("/products/admin/all", { params }),
  adminGet: (id) => api.get(`/products/admin/${id}`),
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.patch(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};

export const categoryApi = {
  list: () => api.get("/categories"),
  create: (payload) => api.post("/categories", payload),
  update: (id, payload) => api.patch(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
};
