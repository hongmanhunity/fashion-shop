const router = require("express").Router();
const {
  createOrder,
  getUserOrders,
  getAllOrdersByAdmin,
  updateOrderStatus,
} = require("../controllers/orderController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// User routes
router.post("/", verifyAccessToken, createOrder);
router.get("/", verifyAccessToken, getUserOrders);

// Admin routes
router.get("/admin", [verifyAccessToken, isAdmin], getAllOrdersByAdmin);
router.put("/status/:orderId", [verifyAccessToken, isAdmin], updateOrderStatus);

module.exports = router;
