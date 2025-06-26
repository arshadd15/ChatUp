const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const {
  getUsersForSideBar,
  getMessages,
  sendMessage,
} = require("../controllers/message.conroller");
const ratelimiter = require("express-rate-limit");
const router = express.Router();

const messageLimiter = ratelimiter({
  windowMs: 60 * 1000, //1 minute
  max: 10, //limit each IP to 100 request per windowMs
  message: "Too many requests from this IP, please try again later.",
});

router.get("/users", protectRoute, getUsersForSideBar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, messageLimiter, sendMessage);

module.exports = router;
