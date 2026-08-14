const {
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
} = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const {
  validateRegister,
  validateLogin,
} = require("../vadilation/AuthValidator");
const router = require("express").Router();

// Endpoint: POST /api/user/register
router.post("/register", validateRegister, register);

// Endpoint: POST /api/user/login
router.post("/login", validateLogin, login);
router.get("/current", verifyAccessToken, getCurrent);
router.put("/current", verifyAccessToken, updateUser);
router.post("/refreshtoken", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/", [verifyAccessToken, isAdmin], getUsers);
router.delete("/deleteUser", [verifyAccessToken, isAdmin], deleteUser);
router.put("/updateUser", verifyAccessToken, updateUser);
router.put(
  "/updateUserByAdmin/:uid",
  [verifyAccessToken, isAdmin],
  updateUserByAdmin,
);
module.exports = router;
