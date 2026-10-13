import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";

import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true, // required so the browser sends/receives the HTTP-only cookie
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . from req.body/query/params to block NoSQL injection

if (!env.isProd) {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => res.json({ success: true, message: "OK" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
