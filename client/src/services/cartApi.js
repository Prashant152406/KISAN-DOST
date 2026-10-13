import api from "./api.js";

export const cartApi = {
  get: () => api.get("/cart"),
  addItem: (productId, quantity = 1) => api.post("/cart/items", { productId, quantity }),
  updateItem: (productId, quantity) => api.patch(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
  clear: () => api.delete("/cart"),
};
