import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validators/marketplace.validator.js";

const router = Router();

router.get("/", categoryController.listCategories);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete("/:id", requireAuth, requireRole("admin"), categoryController.deleteCategory);

export default router;
