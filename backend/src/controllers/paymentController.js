const createRazorpayOrder = async (req, res) => {
  return res.json({ message: "Payment disabled" });
};

const verifyRazorpayPayment = async (req, res) => {
  return res.json({ message: "Payment disabled" });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
