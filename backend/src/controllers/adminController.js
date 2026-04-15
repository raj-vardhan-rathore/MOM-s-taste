const Shop = require("../models/Shop");
const Order = require("../models/Order");
const User = require("../models/User");

const listPendingShops = async (req, res) => {
  const shops = await Shop.find({ approvalStatus: "pending" }).populate("owner", "fullName email phone");
  return res.json({ shops });
};

const approveOrRejectShop = async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be approved or rejected" });
  }

  const shop = await Shop.findByIdAndUpdate(req.params.shopId, { approvalStatus: status }, { new: true });
  if (!shop) return res.status(404).json({ message: "Shop not found" });

  return res.json({ message: `Shop ${status}`, shop });
};

const listUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ users });
};

const listShops = async (req, res) => {
  const shops = await Shop.find().populate("owner", "fullName email").sort({ createdAt: -1 });
  return res.json({ shops });
};

const listAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("parent", "fullName email")
    .populate("shop", "shopName city")
    .sort({ createdAt: -1 });
  return res.json({ orders });
};

const getAnalytics = async (req, res) => {
  const [userCount, shopCount, approvedShops, orderCount, deliveredCount, revenueStats] = await Promise.all([
    User.countDocuments(),
    Shop.countDocuments(),
    Shop.countDocuments({ approvalStatus: "approved" }),
    Order.countDocuments(),
    Order.countDocuments({ status: "delivered" }),
    Order.aggregate([
      { $match: { status: { $in: ["accepted", "out_for_delivery", "delivered"] }, "payment.status": "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]),
  ]);

  return res.json({
    analytics: {
      userCount,
      shopCount,
      approvedShops,
      orderCount,
      deliveredCount,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
    },
  });
};

module.exports = {
  listPendingShops,
  approveOrRejectShop,
  listUsers,
  listShops,
  listAllOrders,
  getAnalytics,
};
