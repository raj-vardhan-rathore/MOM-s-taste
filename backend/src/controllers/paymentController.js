const crypto = require("crypto");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");

const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findOne({ _id: orderId, parent: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });

  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      app: "Moms Taste",
      orderId: String(order._id),
    },
  };

  const rzpOrder = await razorpay.orders.create(options);
  order.payment.razorpayOrderId = rzpOrder.id;
  await order.save();

  return res.json({
    key: process.env.RAZORPAY_KEY_ID,
    razorpayOrder: rzpOrder,
    order,
  });
};

const verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await Order.findOne({ _id: orderId, parent: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    order.payment.status = "failed";
    await order.save();
    return res.status(400).json({ message: "Payment verification failed" });
  }

  order.payment.status = "paid";
  order.payment.razorpayOrderId = razorpayOrderId;
  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.payment.razorpaySignature = razorpaySignature;
  await order.save();

  return res.json({ message: "Payment verified", order });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
