const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  ratings,
} = require("../controllers/productController");
const {
  verifyAccessToken,
  isAdmin,
  isUser,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/ratings", [verifyAccessToken, isUser], ratings);
router.get("/:id", getProduct);
router.put("/:id", [verifyAccessToken, isAdmin], updateProduct);
router.delete("/:id", [verifyAccessToken, isAdmin], deleteProduct);
module.exports = router;
