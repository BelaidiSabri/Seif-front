const Notification = require('../models/Notification.model')

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error); // Log the error details
    res.status(500).json({ message: "Error fetching notifications", error: error.message || error });
  }
};

// Mark all notifications as read
exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ message: "Notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications as read", error });
  }
};

// Create a new notification (utility function for internal use)
exports.createNotification = async ({ user, message }) => {
  try {
    const notification = new NotificationModel({ user, message });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
