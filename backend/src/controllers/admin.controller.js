import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";
import { User } from "../models/User.model.js";

export const getDashboardStats = catchAsync(async (req, res) => {
  const [totalProducts, activeProducts, totalOrders, pendingOrders, totalUsers, revenueAgg] =
    await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: { $in: ["pending", "confirmed", "processing"] } }),
      User.countDocuments({ status: "active" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

  return sendSuccess(res, {
    data: {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalUsers,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});
