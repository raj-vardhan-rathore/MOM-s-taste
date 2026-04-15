const { body } = require("express-validator");
const Shop = require("../models/Shop");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

const getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });
  return res.json({ shop });
};

const updateMyShop = async (req, res) => {
  const allowedFields = ["shopName", "city", "address", "contactNumber", "description", "coverImage", "deliveryMethods", "isOpen"];
  const updates = {};
  allowedFields.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const shop = await Shop.findOneAndUpdate({ owner: req.user._id }, updates, { new: true });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });
  return res.json({ message: "Shop updated", shop });
};

const addMenuItem = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });

  shop.menu.push(req.body);
  await shop.save();
  return res.status(201).json({ message: "Menu item added", menu: shop.menu });
};

const updateMenuItem = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });

  const item = shop.menu.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Menu item not found" });

  Object.assign(item, req.body);
  await shop.save();
  return res.json({ message: "Menu item updated", item });
};

const deleteMenuItem = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });

  const item = shop.menu.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Menu item not found" });

  item.deleteOne();
  await shop.save();
  return res.json({ message: "Menu item deleted", menu: shop.menu });
};

const listIncomingOrders = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });

  const orders = await Order.find({ shop: shop._id })
    .populate("parent", "fullName phone email")
    .sort({ createdAt: -1 });

  return res.json({ orders });
};

const updateOrderStatus = async (req, res) => {
  const { status, note, deliveryMethod } = req.body;

  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop profile not found" });

  const order = await Order.findOne({ _id: req.params.orderId, shop: shop._id });
  if (!order) return res.status(404).json({ message: "Order not found" });

  const valid = ["accepted", "rejected", "out_for_delivery", "delivered"];
  if (!valid.includes(status)) return res.status(400).json({ message: "Invalid order status" });

  order.status = status;
  if (deliveryMethod) order.deliveryMethod = deliveryMethod;
  order.statusTimeline.push({ status, note: note || "", updatedBy: req.user._id });
  await order.save();

  await Notification.create({
    user: order.parent,
    title: "Order Status Updated",
    message: `Order ${order.orderNumber} is now ${status.replaceAll("_", " ")}`,
    metadata: { orderId: order._id, status },
  });

  if (global.io) {
    global.io.to(String(order.parent)).emit("order:status", {
      orderId: order._id,
      status,
      note: note || "",
      deliveryMethod: order.deliveryMethod,
    });
  }

  return res.json({ message: "Order status updated", order });
};

const shopValidators = {
  menuItem: [body("name").notEmpty(), body("price").isFloat({ min: 0 }), body("category").notEmpty()],
  updateOrderStatus: [body("status").notEmpty()],
};

module.exports = {
  getMyShop,
  updateMyShop,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listIncomingOrders,
  updateOrderStatus,
  shopValidators,
};
