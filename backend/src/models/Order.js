const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    child: {
      childId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      rollNumber: { type: String, required: true },
      hostelId: { type: String, required: true },
      roomNumber: { type: String, required: true },
      city: { type: String, required: true },
      hostelAddress: { type: String, required: true },
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    items: [orderItemSchema],
    emotionalMessage: { type: String, default: "", maxlength: 240 },
    scheduledFor: { type: Date, required: true },
    deliveryMethod: { type: String, enum: ["self", "third_party"], default: "self" },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    payment: {
      provider: { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      razorpayOrderId: { type: String, default: "" },
      razorpayPaymentId: { type: String, default: "" },
      razorpaySignature: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["placed", "accepted", "rejected", "out_for_delivery", "delivered"],
      default: "placed",
      index: true,
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: "" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre("save", function assignOrderNumber(next) {
  if (!this.orderNumber) {
    this.orderNumber = `MT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
