import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderSchema,
  verifyPaymentSchema,
  cancelOrderSchema,
  updateOrderStatusSchema,
} from "../validators/marketplace.validator.js";

const router = Router();

router.get("/payment-status", orderController.paymentStatus); // public: is Razorpay configured?

router.use(requireAuth); // everything below needs a logged-in user

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.post("/verify-payment", validate(verifyPaymentSchema), orderController.verifyPayment);
router.get("/", orderController.listMyOrders);
router.get("/:id", orderController.getMyOrder);
router.post("/:id/cancel", validate(cancelOrderSchema), orderController.cancelMyOrder);

// --- Admin ---
router.get("/admin/all", requireRole("admin"), orderController.adminListOrders);
router.patch(
  "/admin/:id/status",
  requireRole("admin"),
  validate(updateOrderStatusSchema),
  orderController.adminUpdateOrderStatus
);

export default router;
