const mongoose = require("mongoose");


const DonationRequestSchema = new mongoose.Schema({
    product: { // Product being requested
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    requestedBy: { // User requesting the product
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: { // Pending, Accepted, Rejected
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const DonationRequest = mongoose.model('DonationRequest', DonationRequestSchema);
  module.exports = DonationRequest;
  