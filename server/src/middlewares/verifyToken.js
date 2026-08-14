const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Client phải gửi token trong header Authorization với prefix là 'Bearer '
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1]; // Tách chữ Bearer ra để lấy cái mã

    // Dùng con dấu JWT_SECRET để check xem thẻ giả hay thật, còn hạn hay hết
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid access token" });
      }
      // Nếu thẻ xịn, lưu thông tin giải mã (chứa _id và role) vào req để các bước sau dùng
      req.user = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Require authentication!!!" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { _id, role } = req.user;
  console.log("Check role: ", role, "Check id: ", _id);
  if (role !== "admin") {
    return res.status(401).json({
      success: false,
      mes: "REQUIRE ADMIN ROLE - Bạn không có quyền truy cập!",
    });
  }
  next();
});

const isUser = asyncHandler(async (req, res, next) => {
  const { _id, role } = req.user;
  if (role !== "user") {
    return res.status(401).json({
      success: false,
      mes: "JUST FOR USER - Quản trị viên thì miễn!",
    });
  }
  next();
});

module.exports = { verifyAccessToken, isAdmin, isUser };
