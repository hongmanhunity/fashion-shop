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
  const product = await Product.findById(id).populate({
    path: "ratings.postedBy",
    select: "firstname lastname email avatar",
  });
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
  // 1. FILTERING (Lọc dữ liệu căn bản & khoảng giá)
  const queries = { ...req.query };
  // Các trường đặc biệt dùng cho điều khiển, không dùng để lọc DB
  const excludeFields = ["page", "sort", "limit", "fields", "q"];
  excludeFields.forEach((el) => delete queries[el]);

  // Chuyển các toán tử gte, gt, lte, lt thành $gte, $gt, $lte, $lt
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const formattedQueries = JSON.parse(queryString);

  // 💡 CHÌA KHÓA SỬA LỖI GIÁ: Ép kiểu chuỗi số ("500000") về kiểu Number (500000) trong MongoDB
  const formatNumericValues = (obj) => {
    for (let k in obj) {
      if (typeof obj[k] === "object" && obj[k] !== null) {
        formatNumericValues(obj[k]);
      } else if (typeof obj[k] === "string" && !isNaN(obj[k]) && obj[k].trim() !== "") {
        obj[k] = Number(obj[k]);
      }
    }
  };
  formatNumericValues(formattedQueries);

  // Safety Net: Chuyển đổi flat keys dạng "price[$gte]" hoặc "price[gte]" thành object lồng nhau chuẩn MongoDB
  Object.keys(formattedQueries).forEach((key) => {
    const match = key.match(/^(\w+)\[\$?(gte|gt|lte|lt)\]$/);
    if (match) {
      const [, field, op] = match;
      if (!formattedQueries[field]) formattedQueries[field] = {};
      formattedQueries[field][`$${op}`] = Number(formattedQueries[key]);
      delete formattedQueries[key];
    }
  });

  // 💡 CHÌA KHÓA SỬA LỖI DANH MỤC: Xử lý linh hoạt nếu truyền chuỗi chữ hoặc ObjectId
  if (formattedQueries.category) {
    if (mongoose.Types.ObjectId.isValid(formattedQueries.category)) {
      formattedQueries.category = new mongoose.Types.ObjectId(formattedQueries.category);
    } else {
      // Nếu truyền chữ như "Ao", "Quan", "Vay", tìm tương đối theo tiêu đề hoặc thương hiệu
      const catRegex = new RegExp(formattedQueries.category, "i");
      delete formattedQueries.category;
      formattedQueries.$or = [
        { title: catRegex },
        { brand: catRegex }
      ];
    }
  }

  // Hỗ trợ Tìm kiếm từ khóa (Search Query) nếu có truyền ?q=từ_khóa
  if (req.query.q) {
    formattedQueries.$text = { $search: req.query.q };
  }

  // Khởi tạo Mongoose Query (Kiểm tra xem Model Category đã đăng ký chưa mới populate)
  let queryCommand = mongoose.models.Category
    ? Product.find(formattedQueries).populate("category", "title slug")
    : Product.find(formattedQueries);

  // 2. SORTING (Sắp xếp)
  if (req.query.sort) {
    // VD: ?sort=price,-createdAt -> 'price -createdAt'
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else {
    // Mặc định sắp xếp theo sản phẩm mới nhất
    queryCommand = queryCommand.sort("-createdAt");
  }

  // 3. FIELD LIMITING (Chọn các trường trả về)
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  } else {
    queryCommand = queryCommand.select("-__v");
  }

  // 4. PAGINATION (Phân trang)
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // Thực thi query
  try {
    const products = await queryCommand;
    const totalCount = await Product.countDocuments(formattedQueries);

    return res.status(200).json({
      success: true,
      counts: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    throw new Error(error.message);
  }
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
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  // Lấy sản phẩm lên để thao tác
  const ratingProduct = await Product.findById(pid);
  if (!ratingProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // 3. LOGIC CỐT LÕI: Kiểm tra xem user này đã từng rate sản phẩm này chưa?
  const alreadyRatingIndex = ratingProduct.ratings.findIndex(
    (el) => el.postedBy.toString() === _id.toString(),
  );

  if (alreadyRatingIndex !== -1) {
    // TRƯỜNG HỢP 1: Đã đánh giá rồi -> CẬP NHẬT LẠI
    ratingProduct.ratings[alreadyRatingIndex].star = Number(star);
    ratingProduct.ratings[alreadyRatingIndex].comment = comment;
  } else {
    // TRƯỜNG HỢP 2: Lần đầu đánh giá -> THÊM MỚI
    ratingProduct.ratings.push({
      star: Number(star),
      comment,
      postedBy: _id,
    });
  }

  // 4. TÍNH TOÁN LẠI ĐIỂM RATING TRUNG BÌNH (totalRatings)
  const ratingCount = ratingProduct.ratings.length;
  const sumRatings = ratingProduct.ratings.reduce(
    (sum, el) => sum + el.star,
    0,
  );
  ratingProduct.totalRatings =
    Math.round((sumRatings / ratingCount) * 10) / 10;

  await ratingProduct.save();

  return res.status(200).json({
    success: true,
    message: "Ghi nhận đánh giá thành công!",
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
