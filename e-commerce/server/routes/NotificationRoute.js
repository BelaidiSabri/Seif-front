const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationCtrl");
const auth = require("../middleware/auth");

// Route to get all notifications for the logged-in user
router.get("/", auth, NotificationController.getNotifications);

// Route to mark all notifications as read
router.put("/mark-read", auth, NotificationController.markNotificationsRead);

module.exports = router;
