const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  productOffered: { // Product user wants to give
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productRequested: { // Product user wants in exchange
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  offeredBy: { // User offering the exchange
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedTo: { // Owner of the requested product
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

const Exchange = mongoose.model('Exchange', ExchangeSchema);
module.exports = Exchange;
