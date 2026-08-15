const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    // 💡 TRỌNG ĐIỂM SEO: Trường Slug (vd: dien-thoai-iphone-15)
    slug: { type: String, required: true, unique: true, lowercase: true },

    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },

    // Tham chiếu (ref) sang collection Category
    category: { type: mongoose.Types.ObjectId, ref: "Category" },

    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    images: { type: Array },
    color: { type: String, enum: ["Black", "Brown", "Red"] },
    // Mảng chứa các lượt đánh giá, tham chiếu thẳng đến người đánh giá (User)
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRatings: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// 🔍 1. Text Index: Cho ô Tìm kiếm sản phẩm theo từ khóa (Full-Text Search)
productSchema.index({ title: "text", description: "text", brand: "text" });

// 🚀 2. Compound Index (Category + Price): Cho bộ lọc Danh mục & Khoảng giá (Chuẩn ESR)
productSchema.index({ category: 1, price: 1 });

// 🚀 3. Compound Index (Brand + Price): Cho bộ lọc Thương hiệu & Khoảng giá
productSchema.index({ brand: 1, price: 1 });

// ⚡ 4. Index Sắp xếp Sản phẩm mới nhất
productSchema.index({ createdAt: -1 });

// ⚡ 5. Index cho Danh sách Sản phẩm bán chạy & Đánh giá cao
productSchema.index({ totalRatings: -1, sold: -1 });

module.exports = mongoose.model("Products", productSchema);
