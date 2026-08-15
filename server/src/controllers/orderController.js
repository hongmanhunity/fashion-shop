const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

/**
 * 💡 CONTROLLER: TẠO ĐƠN HÀNG MỚI (TỪ GIỎ HÀNG)
 * ----------------------------------------------------------------------
 * Quy trình xử lý nghiệp vụ (Business Logic Flow):
 * 1. Đọc ID người dùng từ `req.user._id` (được giải mã từ Token qua middleware verifyAccessToken).
 * 2. Lấy danh sách sản phẩm trong giỏ hàng (`User.cart`). Nếu rỗng -> Chặn lại.
 * 3. Sinh Mã Giao Dịch duy nhất (Unique Transaction ID) & Xác định phương thức thanh toán.
 * 4. Tạo document `Order` mới trong cơ sở dữ liệu MongoDB.
 * 5. Cập nhật tồn kho sản phẩm (`Product.quantity` giảm, `Product.sold` tăng).
 * 6. Xóa rỗng giỏ hàng người dùng (`User.cart = []`).
 */
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { address, paymentMethod } = req.body;

  // 1. Kiểm tra giỏ hàng người dùng
  const user = await User.findById(_id);
  if (!user || !user.cart || user.cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Giỏ hàng của bạn đang rỗng, không thể tạo đơn hàng!",
    });
  }

  // 2. Chuyển đổi mảng `cart` sang định dạng mảng `products` của Đơn hàng
  const orderProducts = user.cart.map((item) => ({
    product: item.product,
    count: item.quantity,
    color: item.color,
    price: item.price,
  }));

  // 3. Tính tổng số tiền cần thanh toán
  const total = user.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 4. Sinh Mã giao dịch duy nhất (VD: TRANS_1723739821_4912) & Xác định trạng thái thanh toán
  const transactionId = `TRANS_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const method = paymentMethod || "COD";
  let paymentStatus = "Pending";
  let paymentInfo = { transactionId };

  if (method === "BANK_TRANSFER") {
    paymentStatus = "Paid";
    paymentInfo = {
      transactionId,
      paidAt: new Date(),
      bankName: req.body?.bankName || "VietQR / MBBank",
    };
  } else if (method === "CREDIT_CARD") {
    paymentStatus = "Paid";
    paymentInfo = {
      transactionId,
      paidAt: new Date(),
      cardLast4: req.body?.cardNumber ? req.body.cardNumber.slice(-4) : "8888",
    };
  }

  // 5. Lưu thông tin Đơn hàng mới vào MongoDB
  const newOrder = await Order.create({
    products: orderProducts,
    total,
    orderBy: _id,
    address: address || user.address || "Chưa cập nhật địa chỉ",
    paymentMethod: method,
    paymentStatus,
    paymentInfo,
  });

  if (newOrder) {
    // 6. ⚡ TRỪ HÀNG TỒN KHO & TĂNG SỐ LƯỢNG ĐÃ BÁN NGUYÊN TỬ FOR TỪNG SẢN PHẨM
    for (let item of user.cart) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity, sold: +item.quantity },
      });
    }

    // 7. ⚡ LÀM RỖNG GIỎ HÀNG CỦA USER SAU KHI ĐẶT HÀNG THÀNH CÔNG
    await User.findByIdAndUpdate(_id, { $set: { cart: [] } });
  }

  return res.status(200).json({
    success: true,
    message: "Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.",
    order: newOrder,
  });
});

/**
 * 💡 CONTROLLER: LẤY DANH SÁCH ĐƠN HÀNG CỦA CÁ NHÂN USER
 */
const getUserOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const orders = await Order.find({ orderBy: _id })
    .populate("products.product", "title price images")
    .sort("-createdAt");

  return res.status(200).json({
    success: true,
    orders,
  });
});

/**
 * 💡 CONTROLLER: ADMIN LẤY TOÀN BỘ ĐƠN HÀNG HỆ THỐNG
 */
const getAllOrdersByAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("orderBy", "firstname lastname email mobile")
    .populate("products.product", "title price images")
    .sort("-createdAt");

  return res.status(200).json({
    success: true,
    orders,
  });
});

/**
 * 💡 CONTROLLER: ADMIN CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Thiếu trạng thái đơn hàng!" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Cập nhật trạng thái đơn hàng thành công!",
    order: updatedOrder,
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrdersByAdmin,
  updateOrderStatus,
};
