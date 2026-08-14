const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const brcypt = require("bcrypt");
const { generateAccessToken } = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  //Validate
  if (!email || !password || !lastname || !firstname || !mobile) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ các trường yêu cầu!",
    });
  }

  const response = await User.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing inputs",
    });
  }
  const response = await User.findOne({ email });
  if (!response) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials!", // Thông tin đăng nhập không hợp lệ
    });
  }
  const isMatch = await response.isCorrectPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials!", // Thông tin đăng nhập không hợp lệ
    });
  }
  //Generate Access Token
  const accessToken = generateAccessToken(response._id, response.role);
  const refreshToken = generateAccessToken(response._id);
  await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
  //Luu vao cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // Sống đúng 7 ngày
  });
  const { role, password: _, ...userData } = response.toObject();
  return res.status(200).json({
    success: true,
    accessToken,
    userData, // Chỉ trả về những gì an toàn
  });
});

const getCurrent = asyncHandler(async (req, res) => {
  // Cái req.user._id này có được là nhờ cái chốt chặn verifyAccessToken ở trên gán vào đó
  const { _id } = req.user;

  // Dấu trừ đằng trước nghĩa là "lấy hết thông tin NHƯNG trừ mấy trường này ra"
  const user = await User.findById(_id).select("-refreshToken -password -role");

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  return res.status(200).json({ success: true, user });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // 1. Lấy toàn bộ cookie mà trình duyệt tự động đính kèm gửi lên
  const cookie = req.cookies;

  // 2. Check xem trong túi có Refresh Token không
  if (!cookie || !cookie.refreshToken) {
    throw new Error("Không tìm thấy refresh token trong cookies!");
  }

  // 3. Đưa token vào máy soi (verify) xem có phải hàng giả hay hàng hết hạn không
  jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET,
    async (err, decode) => {
      // Nếu lỗi (hết hạn, sai chữ ký...) thì chặn luôn
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Refresh token không hợp lệ hoặc đã hết hạn",
        });
      }

      // 4. Tuyệt chiêu bảo mật: Token thật, nhưng có phải của User đó trên DB không?
      // Phải query DB để so sánh cái token dưới Cookie với cái token lưu ở Bài 5
      // (💡 Tip nhỏ: Chỗ này anh em cẩn thận gõ nhầm 'User' thành 'Use' là toang server nha)
      const response = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
      });

      // 5. Nếu mọi thứ khớp hoàn hảo, in thẻ Access Token mới đưa cho Frontend
      return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
          ? generateAccessToken(response._id, response.role)
          : "Refresh token không khớp với Database",
      });
    },
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) {
    throw new Error("Không tìm thấy refresh token trong cookies");
  }
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true },
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
  });
  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công!",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  //Lay email tu req
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const rs_user = await User.findOne({ email });
  if (!rs_user) throw new Error("User not found");
  const resetToken = rs_user.createPasswordChangedToken();
  await rs_user.save();
  // Cấu trúc nội dung Email
  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút. 
  <a href="${process.env.URL_CLIENT}/reset-password/${resetToken}">Nhấn vào đây để đổi mật khẩu</a>`;

  const data = { email, html };

  // Gọi anh shipper nodemailer đi giao hàng
  const rs = await sendMail(data);

  return res.status(200).json({
    success: true,
    message: "Email khôi phục đã được gửi. Vui lòng check hộp thư!",
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    throw new Error("Missing inputs");
  }

  // Hash token để đem đi so sánh với token đã mã hóa dưới DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const rs_user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!rs_user) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn!");
  }

  // Đổi mật khẩu mới
  rs_user.password = password;
  rs_user.passwordResetToken = undefined;
  rs_user.passwordResetExpires = undefined;
  rs_user.passwordChangeAt = Date.now().toString();

  await rs_user.save();

  return res.status(200).json({
    success: true,
    message: "Cập nhật mật khẩu thành công!",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) {
    throw new Error("Missing inputs - Bạn chưa cung cấp ID của User cần xóa!");
  }
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    // Nếu response có data tức là xóa thành công (true), ngược lại là false
    success: !!response,
    // Trả về câu thông báo cho Front-end biết đường mà hiện popup
    deletedUser: response
      ? `Tài khoản có email ${response.email} đã bị xóa vĩnh viễn`
      : "Không tìm thấy user nào để xóa",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs - Bạn chưa nhập thông tin cần cập nhật");
  }
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role");

  return res.status(200).json({
    success: !!response,
    updateUser: response || "Something went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  // 💡 Lấy UID từ params (đường dẫn URL), thay vì từ req.user
  const { uid } = req.params;

  // Validate: Chặn mấy pha gọi API mà body rỗng tuếch
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs - Không có dữ liệu để cập nhật");
  }

  // Gọi Mongoose update mục tiêu
  const response = await User.findByIdAndUpdate(
    uid,
    req.body,
    { new: true }, // Vẫn phải có cờ này để Mongoose trả về data MỚI
  ).select("-password -role"); // Che giấu dữ liệu nhạy cảm

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
};
