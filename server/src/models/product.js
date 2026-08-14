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

module.exports = mongoose.model("Products", productSchema);
