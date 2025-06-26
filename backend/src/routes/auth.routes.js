const express = require("express");
const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} = require("../controllers/auth.controller");
const protectRoute = require("../middleware/auth.middleware");
const ratelimiter = require("express-rate-limit");

const router = express.Router();

const authLimiter = ratelimiter({
  windowMs: 60 * 1000, //1 minute
  max: 5, //limit each IP to 5 request per windowMs
  message: "Too many login attempts, please try again later.",
});

router.post("/signup", signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

module.exports = router;
