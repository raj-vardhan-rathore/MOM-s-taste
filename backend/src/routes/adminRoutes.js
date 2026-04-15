const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
  listPendingShops,
  approveOrRejectShop,
  listUsers,
  listShops,
  listAllOrders,
  getAnalytics,
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/shops/pending", asyncHandler(listPendingShops));
router.patch("/shops/:shopId/approval", asyncHandler(approveOrRejectShop));
router.get("/users", asyncHandler(listUsers));
router.get("/shops", asyncHandler(listShops));
router.get("/orders", asyncHandler(listAllOrders));
router.get("/analytics", asyncHandler(getAnalytics));

module.exports = router;
