import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import * as cartService from "../services/cart.service.js";

export const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return sendSuccess(res, { data: { cart } });
});

export const addItem = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(req.user._id, productId, quantity);
  return sendSuccess(res, { message: "Added to cart.", data: { cart } });
});

export const updateItem = catchAsync(async (req, res) => {
  const cart = await cartService.updateItemQuantity(req.user._id, req.params.productId, req.body.quantity);
  return sendSuccess(res, { message: "Cart updated.", data: { cart } });
});

export const removeItem = catchAsync(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  return sendSuccess(res, { message: "Item removed.", data: { cart } });
});

export const clearCart = catchAsync(async (req, res) => {
  await cartService.clearCart(req.user._id);
  return sendSuccess(res, { message: "Cart cleared." });
});
