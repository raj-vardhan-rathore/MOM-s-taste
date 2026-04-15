const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const childSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    hostelId: { type: String, required: true, trim: true },
    roomNumber: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    hostelAddress: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["parent", "shop_owner", "admin"], default: "parent" },
    isActive: { type: Boolean, default: true },
    children: [childSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
