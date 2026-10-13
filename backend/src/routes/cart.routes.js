import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addCartItemSchema, updateCartItemSchema } from "../validators/marketplace.validator.js";

const router = Router();

router.use(requireAuth); // every cart route needs a logged-in user

router.get("/", cartController.getCart);
router.post("/items", validate(addCartItemSchema), cartController.addItem);
router.patch("/items/:productId", validate(updateCartItemSchema), cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
