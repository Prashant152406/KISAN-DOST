import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import * as orderService from "../services/order.service.js";
import { isPaymentsConfigured } from "../services/payment.service.js";

export const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrderFromCart(req.user._id, req.body);
  return sendSuccess(res, { statusCode: 201, message: "Order created.", data: result });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderService.verifyAndFinalizeOrder(req.user._id, req.body);
  return sendSuccess(res, { message: "Payment verified. Order confirmed.", data: { order } });
});

export const listMyOrders = catchAsync(async (req, res) => {
  const result = await orderService.listOrdersForUser(req.user._id, req.query);
  return sendSuccess(res, { data: result });
});

export const getMyOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderForUser(req.user._id, req.params.id);
  return sendSuccess(res, { data: { order } });
});

export const cancelMyOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(req.user._id, req.params.id, req.body.reason);
  return sendSuccess(res, { message: "Order cancelled.", data: { order } });
});

export const paymentStatus = catchAsync(async (req, res) => {
  return sendSuccess(res, { data: { configured: isPaymentsConfigured() } });
});

// --- Admin ---

export const adminListOrders = catchAsync(async (req, res) => {
  const result = await orderService.adminListOrders(req.query);
  return sendSuccess(res, { data: result });
});

export const adminUpdateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.adminUpdateOrderStatus(req.params.id, req.body);
  return sendSuccess(res, { message: "Order status updated.", data: { order } });
});
