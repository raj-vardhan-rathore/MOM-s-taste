const { body } = require("express-validator");
const User = require("../models/User");
const Shop = require("../models/Shop");
const { signToken } = require("../utils/jwt");

const registerParent = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const user = await User.create({ fullName, email, phone, password, role: "parent" });
  const token = signToken({ id: user._id, role: user.role });

  return res.status(201).json({
    message: "Parent registered successfully",
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
};

const registerShopOwner = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    shopName,
    city,
    address,
    contactNumber,
    description,
    deliveryMethods,
  } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const user = await User.create({ fullName, email, phone, password, role: "shop_owner" });

  await Shop.create({
    owner: user._id,
    shopName,
    city,
    address,
    contactNumber,
    description: description || "",
    deliveryMethods: deliveryMethods?.length ? deliveryMethods : ["self"],
    approvalStatus: "pending",
  });

  const token = signToken({ id: user._id, role: user.role });

  return res.status(201).json({
    message: "Shop owner registered. Waiting for admin approval.",
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id, role: user.role });

  return res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
};

const me = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const shop = user.role === "shop_owner" ? await Shop.findOne({ owner: user._id }) : null;
  return res.json({ user, shop });
};

const authValidators = {
  registerParent: [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  registerShopOwner: [
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("shopName").notEmpty(),
    body("city").notEmpty(),
    body("address").notEmpty(),
    body("contactNumber").notEmpty(),
  ],
  login: [body("email").isEmail(), body("password").notEmpty()],
};

module.exports = {
  registerParent,
  registerShopOwner,
  login,
  me,
  authValidators,
};
