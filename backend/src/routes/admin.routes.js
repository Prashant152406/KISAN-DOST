import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", adminController.getDashboardStats);

export default router;
