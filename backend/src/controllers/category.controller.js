import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import * as categoryService from "../services/category.service.js";

export const listCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.listCategories();
  return sendSuccess(res, { data: { categories } });
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return sendSuccess(res, { statusCode: 201, message: "Category created.", data: { category } });
});

export const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return sendSuccess(res, { message: "Category updated.", data: { category } });
});

export const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return sendSuccess(res, { message: "Category deleted." });
});
