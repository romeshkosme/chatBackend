const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const chatController = require("../controller/chat.controller");
const userController = require("../controller/user.controller");
const messageController = require("../controller/message.controller");
const authMiddleware = require("../middleware/auth.middleware");

// auth
router.post("/api/register", authController.register);
router.post("/api/login", authController.login);

// user
router.get("/api/user", authMiddleware, userController.get);

// chat
router.post("/api/chat", authMiddleware, chatController.create); // create or get single chat
router.get("/api/chat", authMiddleware, chatController.get); // get all chats
router.post("/api/chat/group", authMiddleware, chatController.createGroup); // create group
router.put("/api/chat/add-to-group", authMiddleware, chatController.addToGroup); // add to group
router.put("/api/chat/remove-from-group", authMiddleware, chatController.removeFromGroup); // remove from group

// message
router.post("/api/message", authMiddleware, messageController.create);
router.get("/api/message/:chatId", authMiddleware, messageController.getAllMessages);

// invalid

module.exports = router;
