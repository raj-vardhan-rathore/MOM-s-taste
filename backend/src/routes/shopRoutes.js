const express = require("express");
const validate = require("../middleware/validateMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
  getMyShop,
  updateMyShop,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listIncomingOrders,
  updateOrderStatus,
  shopValidators,
} = require("../controllers/shopController");

const router = express.Router();

router.use(protect, authorize("shop_owner"));

router.get("/me", asyncHandler(getMyShop));
router.put("/me", asyncHandler(updateMyShop));

router.post("/menu", shopValidators.menuItem, validate, asyncHandler(addMenuItem));
router.put("/menu/:itemId", asyncHandler(updateMenuItem));
router.delete("/menu/:itemId", asyncHandler(deleteMenuItem));

router.get("/orders", asyncHandler(listIncomingOrders));
router.patch("/orders/:orderId/status", shopValidators.updateOrderStatus, validate, asyncHandler(updateOrderStatus));

module.exports = router;
