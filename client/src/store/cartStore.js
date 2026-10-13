import { create } from "zustand";
import { cartApi } from "../services/cartApi.js";

export const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  isLoading: false,
  error: null,

  itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.get();
      const { items, subtotal } = res.data.data.cart;
      set({ items, subtotal, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const res = await cartApi.addItem(productId, quantity);
    const { items, subtotal } = res.data.data.cart;
    set({ items, subtotal });
  },

  updateItem: async (productId, quantity) => {
    const res = await cartApi.updateItem(productId, quantity);
    const { items, subtotal } = res.data.data.cart;
    set({ items, subtotal });
  },

  removeItem: async (productId) => {
    const res = await cartApi.removeItem(productId);
    const { items, subtotal } = res.data.data.cart;
    set({ items, subtotal });
  },

  clearLocal: () => set({ items: [], subtotal: 0 }),
}));
