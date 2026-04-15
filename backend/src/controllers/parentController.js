const { body } = require("express-validator");
const User = require("../models/User");
const Shop = require("../models/Shop");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

const addChild = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.children.push(req.body);
  await user.save();
  return res.status(201).json({ message: "Child added", children: user.children });
};

const updateChild = async (req, res) => {
  const user = await User.findById(req.user._id);
  const child = user.children.id(req.params.childId);
  if (!child) return res.status(404).json({ message: "Child not found" });

  Object.assign(child, req.body);
  await user.save();
  return res.json({ message: "Child updated", child });
};

const deleteChild = async (req, res) => {
  const user = await User.findById(req.user._id);
  const child = user.children.id(req.params.childId);
  if (!child) return res.status(404).json({ message: "Child not found" });

  child.deleteOne();
  await user.save();
  return res.json({ message: "Child removed", children: user.children });
};

const listChildren = async (req, res) => {
  const user = await User.findById(req.user._id).select("children");
  return res.json({ children: user.children || [] });
};

const listShopsByCity = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: "City query param is required" });

  const shops = await Shop.find({ city, approvalStatus: "approved", isOpen: true }).select("-menu");
  return res.json({ shops });
};

const getShopMenu = async (req, res) => {
  const shop = await Shop.findOne({ _id: req.params.shopId, approvalStatus: "approved" });
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  return res.json({ shop });
};

const placeOrder = async (req, res) => {
  const { childId, shopId, items, emotionalMessage, scheduledFor, deliveryMethod } = req.body;

  const parent = await User.findById(req.user._id);
  const child = parent.children.id(childId);
  if (!child) return res.status(400).json({ message: "Invalid child" });

  const shop = await Shop.findOne({ _id: shopId, approvalStatus: "approved" });
  if (!shop) return res.status(400).json({ message: "Invalid shop" });

  if (child.city.toLowerCase() !== shop.city.toLowerCase()) {
    return res.status(400).json({ message: "Child city and shop city must match" });
  }

  const normalizedItems = [];
  let subtotal = 0;

  for (const line of items || []) {
    const menuItem = shop.menu.id(line.menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(400).json({ message: `Invalid or unavailable menu item: ${line.menuItemId}` });
    }
    const quantity = Number(line.quantity || 1);
    normalizedItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      image: menuItem.image,
    });
    subtotal += menuItem.price * quantity;
  }

  if (!normalizedItems.length) return res.status(400).json({ message: "Order items required" });

  const deliveryFee = subtotal > 499 ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;

  const order = await Order.create({
    parent: parent._id,
    child: {
      childId: child._id,
      name: child.name,
      rollNumber: child.rollNumber,
      hostelId: child.hostelId,
      roomNumber: child.roomNumber,
      city: child.city,
      hostelAddress: child.hostelAddress,
    },
    shop: shop._id,
    items: normalizedItems,
    emotionalMessage: emotionalMessage || "",
    scheduledFor,
    deliveryMethod: deliveryMethod || "self",
    subtotal,
    deliveryFee,
    totalAmount,
    statusTimeline: [{ status: "placed", note: "Order placed by parent", updatedBy: parent._id }],
  });

  await Notification.create({
    user: shop.owner,
    title: "New Order Received",
    message: `Order ${order.orderNumber} was placed for ${child.name}`,
    metadata: { orderId: order._id },
  });

  if (global.io) {
    global.io.to(String(shop.owner)).emit("order:new", { orderId: order._id, orderNumber: order.orderNumber });
  }

  return res.status(201).json({ message: "Order placed", order });
};

const listParentOrders = async (req, res) => {
  const orders = await Order.find({ parent: req.user._id })
    .populate("shop", "shopName city")
    .sort({ createdAt: -1 });
  return res.json({ orders });
};

const listNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
  return res.json({ notifications });
};

const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  return res.json({ message: "Notification updated", notification });
};

const parentValidators = {
  child: [
    body("name").notEmpty(),
    body("rollNumber").notEmpty(),
    body("hostelId").notEmpty(),
    body("roomNumber").notEmpty(),
    body("city").notEmpty(),
    body("hostelAddress").notEmpty(),
  ],
  placeOrder: [
    body("childId").notEmpty(),
    body("shopId").notEmpty(),
    body("scheduledFor").isISO8601().withMessage("Valid schedule date is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  ],
};

module.exports = {
  addChild,
  updateChild,
  deleteChild,
  listChildren,
  listShopsByCity,
  getShopMenu,
  placeOrder,
  listParentOrders,
  listNotifications,
  markNotificationRead,
  parentValidators,
};
