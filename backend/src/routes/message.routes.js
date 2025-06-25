const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const {
  getUsersForSideBar,
  getMessages,
  sendMessage,
} = require("../controllers/message.conroller");
// const upload = require("../middleware/upload.middleware");
const router = express.Router();

router.get("/users", protectRoute, getUsersForSideBar);
router.get("/:id", protectRoute, getMessages);

//uncomment this when you are done and optimizsed everything
// router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
