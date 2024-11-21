const Notification = require('../models/Notification.model')
const Exchange = require('../models/Exchange.model')

// Get all notifications for the logged-in user with populated exchange details
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'exchange',
        populate: [
          { path: 'productOffered', select: 'nom images' },
          { path: 'productRequested', select: 'nom images' },
          { path: 'offeredBy', select: 'email' },
          { path: 'requestedTo', select: 'email' }
        ]
      })
      .populate({
        path: 'donation',
        populate: [
          { path: 'product', select: 'nom images' },
          { path: 'donatedBy', select: 'email' },
          { path: 'donatedTo', select: 'email' }
        ]
      });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
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

// Create a new notification for exchanges
exports.createExchangeNotification = async (exchange, type) => {
  try {
    // Populate the exchange to get product details
    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('productOffered')
      .populate('productRequested')
      .populate('offeredBy')
      .populate('requestedTo');

      const notificationMessages = {
        'exchange_requested': `Nouvelle proposition d'échange pour votre produit "${populatedExchange.productRequested.nom}"`,
        'exchange_accepted': `Votre demande d'échange pour "${populatedExchange.productOffered.nom}" a été acceptée`,
        'exchange_rejected': `Votre demande d'échange pour "${populatedExchange.productOffered.nom}" a été rejetée`,
        'exchange_cancelled': `La proposition d'échange pour "${populatedExchange.productRequested.nom}" a été annulée`,
        'exchange_cancel_by_requester': `La proposition d'échange pour "${populatedExchange.productRequested.nom}" a été annulée par le demandeur`
      };
      

    // Determine the recipient and message based on the type
    const recipientUserId = type === 'exchange_cancelled' 
      ? populatedExchange.requestedTo._id 
      : populatedExchange.offeredBy._id;

    const notification = new Notification({
      user: recipientUserId,
      exchange: exchange._id,
      message: notificationMessages[type],
      type: type
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating exchange notification:", error);
    throw error;
  }
};

// Mark a specific notification as read
exports.markSingleNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ 
      message: "Notification marked as read", 
      notification 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error marking notification as read", 
      error: error.message 
    });
  }
};

// Delete all notifications for the logged-in user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ user: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found to delete" });
    }

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Error deleting notifications", error: error.message || error });
  }
};
///////////////////////////

exports.createDonationNotification = async (donation, type) => {
  try {
    // Populate the donation to get product details
    const populatedDonation = await Donation.findById(donation._id)
      .populate('product')
      .populate('donatedBy')
      .populate('donatedTo');

    const notificationMessages = {
      'donation_requested': `Nouvelle proposition de don pour votre produit "${populatedDonation.product.nom}"`,
      'donation_accepted': `Votre demande de don pour "${populatedDonation.product.nom}" a été acceptée`,
      'donation_rejected': `Votre demande de don pour "${populatedDonation.product.nom}" a été rejetée`,
      'donation_cancelled': `La proposition de don pour "${populatedDonation.product.nom}" a été annulée`,
      'donation_cancel_by_requester': `La proposition de don pour "${populatedDonation.product.nom}" a été annulée par le demandeur`
    };

    // Determine the recipient and message based on the type
    const recipientUserId = type === 'donation_cancelled' 
      ? populatedDonation.donatedTo._id 
      : populatedDonation.donatedBy._id;

    const notification = new Notification({
      user: recipientUserId,
      donation: donation._id,
      message: notificationMessages[type],
      type: type
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating donation notification:", error);
    throw error;
  }
};