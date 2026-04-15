const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/paymentController");

const router = express.Router();

router.use(protect, authorize("parent"));
router.post("/create-order", asyncHandler(createRazorpayOrder));
router.post("/verify", asyncHandler(verifyRazorpayPayment));

module.exports = router;
