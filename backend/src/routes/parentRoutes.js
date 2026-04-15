const express = require("express");
const validate = require("../middleware/validateMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
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
} = require("../controllers/parentController");

const router = express.Router();

router.use(protect, authorize("parent"));

router.get("/children", asyncHandler(listChildren));
router.post("/children", parentValidators.child, validate, asyncHandler(addChild));
router.put("/children/:childId", parentValidators.child, validate, asyncHandler(updateChild));
router.delete("/children/:childId", asyncHandler(deleteChild));

router.get("/shops", asyncHandler(listShopsByCity));
router.get("/shops/:shopId/menu", asyncHandler(getShopMenu));

router.post("/orders", parentValidators.placeOrder, validate, asyncHandler(placeOrder));
router.get("/orders", asyncHandler(listParentOrders));

router.get("/notifications", asyncHandler(listNotifications));
router.patch("/notifications/:id/read", asyncHandler(markNotificationRead));

module.exports = router;
