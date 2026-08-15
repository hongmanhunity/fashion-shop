const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    brand: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
