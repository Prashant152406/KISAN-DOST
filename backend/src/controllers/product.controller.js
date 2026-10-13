import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import * as productService from "../services/product.service.js";

export const listProducts = catchAsync(async (req, res) => {
  const result = await productService.listProducts(req.query);
  return sendSuccess(res, { data: result });
});

export const getProductBySlug = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  return sendSuccess(res, { data: { product } });
});

// --- Admin ---

export const adminListProducts = catchAsync(async (req, res) => {
  const result = await productService.listProductsForAdmin(req.query);
  return sendSuccess(res, { data: result });
});

export const adminGetProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductByIdForAdmin(req.params.id);
  return sendSuccess(res, { data: { product } });
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.user._id, req.body);
  return sendSuccess(res, { statusCode: 201, message: "Product created.", data: { product } });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return sendSuccess(res, { message: "Product updated.", data: { product } });
});

export const deactivateProduct = catchAsync(async (req, res) => {
  await productService.deactivateProduct(req.params.id);
  return sendSuccess(res, { message: "Product removed from listings." });
});
