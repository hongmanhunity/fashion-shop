const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify"); // Import tool tạo slug

const createProduct = asyncHandler(async (req, res) => {
  // Validate cơ bản: Body rỗng thì đuổi về
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs - Bạn chưa nhập thông tin sản phẩm");
  }

  // Bắt buộc phải có tên sản phẩm để còn tạo Slug
  if (!req.body.title || req.body.title.trim() === "") {
    throw new Error(
      "Product title is required - Tên sản phẩm không được bỏ trống",
    );
  }

  // 💡 AUTO GEN SLUG: Khách chỉ cần nhập Title, Server tự lo phần Slug
  req.body.slug = slugify(req.body.title);

  // Tiến hành lưu vào Database
  const newProduct = await Product.create(req.body);

  return res.status(200).json({
    success: true,
    product: newProduct,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  return res.status(200).json({
    success: product ? true : false,
    productData: product
      ? product
      : "Cannot get product - Không tìm thấy sản phẩm",
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: !!updateProduct,
    updateProduct:
      updateProduct || "Cannot update products - Cập nhật thất bại",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  return res.status(200).json({
    success: !!deleteProduct,
    deletedProduct: deletedProduct || "Cannot delete product - Xóa thất bại",
  });
});

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
