const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["Sweet", "Snacks", "Beverages", "Combo", "Festival"],
      default: "Sweet",
    },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: true }
);

const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    shopName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    coverImage: { type: String, default: "" },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    deliveryMethods: [{ type: String, enum: ["self", "third_party"] }],
    menu: [menuItemSchema],
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
