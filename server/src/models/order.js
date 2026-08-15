const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Products" },
        count: { type: Number, required: true },
        color: { type: String },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipping", "Success", "Cancelled"],
    },
    total: { type: Number, required: true },
    orderBy: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    address: { type: String, required: true },
    paymentMethod: {
      type: String,
      default: "COD",
      enum: ["COD", "BANK_TRANSFER", "CREDIT_CARD"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed"],
    },
    paymentInfo: {
      transactionId: { type: String },
      paidAt: { type: Date },
      bankName: { type: String },
      cardLast4: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Index giúp tìm đơn hàng của user nhanh chóng
orderSchema.index({ orderBy: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
