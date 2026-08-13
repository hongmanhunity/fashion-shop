const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

var userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, index: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    cart: { type: Array, default: [] },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    passwordChangeAt: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: String },
  },
  {
    timestamps: true, // Tự động sinh ra 2 trường createdAt và updatedAt
  },
);
// Hash password trước khi lưu
userSchema.pre("save", function (next) {
  // Nếu password không bị thay đổi thì bỏ qua
  if (!this.isModified("password")) {
    return next();
  }

  // Dùng sync để đảm bảo hook chạy xong không bị lỡ nhịp Promise
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    // 1. Sinh ra một chuỗi ngẫu nhiên dài 32 byte
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 💡 KINH NGHIỆM XƯƠNG MÁU: Không lưu chuỗi raw này vào DB!
    // Phải băm (hash) nó ra bằng sha256 rồi mới lưu.
    // Tránh trường hợp DB bị leak, hacker cũng không có token gốc để xài.
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 2. Set hạn sử dụng cho token là 15 phút tính từ hiện tại
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    // 3. Trả về chuỗi raw để Controller nhét vào Email gửi đi
    return resetToken;
  },
};
module.exports = mongoose.model("User", userSchema);
