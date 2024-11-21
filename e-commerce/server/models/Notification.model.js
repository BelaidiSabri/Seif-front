const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exchange"
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation"
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'exchange_requested', 'exchange_accepted', 'exchange_rejected', 'exchange_cancelled', 'exchange_cancel_by_requester',
      'donation_requested', 'donation_accepted', 'donation_rejected', 'donation_cancelled', 'donation_cancel_by_requester'
    ],
    
    required: true
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);


