const express = require("express");
const validate = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
  registerParent,
  registerShopOwner,
  login,
  me,
  authValidators,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/parent", authValidators.registerParent, validate, asyncHandler(registerParent));
router.post("/register/shop-owner", authValidators.registerShopOwner, validate, asyncHandler(registerShopOwner));
router.post("/login", authValidators.login, validate, asyncHandler(login));
router.get("/me", protect, asyncHandler(me));

module.exports = router;
