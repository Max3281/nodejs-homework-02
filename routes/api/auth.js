const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  verifyEmail,
  resendVerification,
} = require("../../controllers/auth");
const authenticate = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", resendVerification);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/login", loginUser);
router.get("/current", authenticate, currentUser);
router.get("/logout", authenticate, logoutUser);

module.exports = router;
