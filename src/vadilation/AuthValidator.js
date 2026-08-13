const { check, validationResult } = require("express-validator");

// Middleware validation cho đăng ký
const validateRegister = [
  check("firstname")
    .notEmpty()
    .withMessage("Firstname không được để trống")
    .isLength({ min: 2 })
    .withMessage("Firstname phải có ít nhất 2 ký tự")
    .matches(/^[\p{L} ]+$/u)
    .withMessage("Firstname chỉ được chứa chữ cái"),

  check("lastname")
    .notEmpty()
    .withMessage("Lastname không được để trống")
    .isLength({ min: 2 })
    .withMessage("Lastname phải có ít nhất 2 ký tự")
    .matches(/^[\p{L} ]+$/u)
    .withMessage("Lastname chỉ được chứa chữ cái"),

  check("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  check("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  check("mobile")
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    // Regex check số điện thoại nhà mạng VN
    .matches(/^(0[3-9])+([0-9]{8})$/)
    .withMessage("Số điện thoại không hợp lệ"),

  // Middleware cuối cùng để hứng lỗi nếu có
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => err.msg), // Trả về mảng các câu thông báo lỗi cho Front-end
      });
    }
    next(); // Nếu không có lỗi gì thì cho phép đi tiếp vào Controller
  },
];

const validateLogin = [
  check("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  check("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  // Hứng lỗi và trả về
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => err.msg),
      });
    }
    next();
  },
];

module.exports = { validateLogin, validateRegister };
