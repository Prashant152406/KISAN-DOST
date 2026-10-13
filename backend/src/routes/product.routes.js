import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/marketplace.validator.js";

const router = Router();

// --- Public browsing ---
router.get("/", productController.listProducts);

// --- Admin management (must come before the public /:slug route) ---
router.get("/admin/all", requireAuth, requireRole("admin", "seller"), productController.adminListProducts);
router.get("/admin/:id", requireAuth, requireRole("admin", "seller"), productController.adminGetProduct);
router.post(
  "/",
  requireAuth,
  requireRole("admin", "seller"),
  validate(createProductSchema),
  productController.createProduct
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "seller"),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete("/:id", requireAuth, requireRole("admin", "seller"), productController.deactivateProduct);

// --- Public product detail (slug-based, kept last so it doesn't shadow the routes above) ---
router.get("/:slug", productController.getProductBySlug);

export default router;
