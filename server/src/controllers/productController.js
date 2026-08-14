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
    success: !!deletedProduct,
    deletedProduct: deletedProduct || "Cannot delete product - Xóa thất bại",
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  // Thực hiện lấy toàn bộ sản phẩm
  const products = await Product.find();
  return res.status(200).json({
    success: true,
    products,
  });
});

const mongoose = require("mongoose"); // Nhớ import mongoose vào đầu file nhé

const ratings = asyncHandler(async (req, res) => {
  // 1. Nhận diện người đánh giá (Lấy _id từ token)
  const { _id } = req.user;

  // 2. Lấy nội dung đánh giá từ Frontend gửi lên
  const { star, comment, pid } = req.body;

  // Kiểm tra đầu vào cơ bản
  if (!star || !pid)
    throw new Error("Missing inputs - Thiếu số sao hoặc ID sản phẩm");

  // 💡 ĐIỂM SÁNG PHÒNG THỦ: Kiểm tra pid có phải định dạng ObjectId hợp lệ không
  // Rất nhiều trường hợp Frontend gửi lên 1 chuỗi linh tinh làm app bị crash khi query
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  // Chuyển đổi an toàn sang dạng ObjectId để so sánh chuẩn xác
  const userId = mongoose.Types.ObjectId(_id);
  const productId = mongoose.Types.ObjectId(pid);

  // Lấy sản phẩm lên để thao tác
  const ratingProduct = await Product.findById(productId);
  if (!ratingProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // 3. LOGIC CỐT LÕI: Kiểm tra xem user này đã từng rate sản phẩm này chưa?
  // Tìm trong mảng ratings xem có cái object nào mà postedBy trùng với ID của thằng đang gửi request không
  const alreadyRatingIndex = ratingProduct.ratings.findIndex(
    (el) => el.postedBy.toString() === userId.toString(),
  );

  if (alreadyRatingIndex !== -1) {
    // TRƯỜNG HỢP 1: Đã đánh giá rồi -> CẬP NHẬT LẠI
    // Tìm thấy vị trí (index) rồi thì cứ chui thẳng vào đó mà gán lại giá trị mới
    ratingProduct.ratings[alreadyRatingIndex].star = star;
    ratingProduct.ratings[alreadyRatingIndex].comment = comment;

    await ratingProduct.save();
  } else {
    // TRƯỜNG HỢP 2: Lần đầu đánh giá -> THÊM MỚI
    // Dùng push() để nhét 1 object mới toanh vào cuối mảng ratings
    ratingProduct.ratings.push({ star, comment, postedBy: userId });

    await ratingProduct.save();
  }

  return res.status(200).json({
    status: true,
    message:
      "Rating successfully added or updated - Ghi nhận đánh giá thành công!",
  });
});

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  ratings,
};
