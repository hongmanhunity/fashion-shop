const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", [verifyAccessToken, isAdmin], updateProduct);
router.delete("/:id", [verifyAccessToken, isAdmin], deleteProduct);
module.exports = router;
