const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../../controllers/auth");
const authenticate = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authenticate, currentUser);
router.post("/logout", authenticate, logoutUser);

module.exports = router;
