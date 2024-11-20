// Exchange.js
const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  productOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Offered product is required']
  },
  productRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Requested product is required']
  },
  offeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Offering user is required']
  },
  requestedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requested user is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ExchangeSchema.index({ productOffered: 1, productRequested: 1 });
ExchangeSchema.index({ offeredBy: 1 });
ExchangeSchema.index({ requestedTo: 1 });
ExchangeSchema.index({ status: 1 });
ExchangeSchema.index({ createdAt: -1 });

// Middleware to update lastUpdated timestamp
ExchangeSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Validate that users are different
ExchangeSchema.pre('save', async function(next) {
  if (this.offeredBy.toString() === this.requestedTo.toString()) {
    next(new Error('Cannot create an exchange with yourself'));
  }
  next();
});

// Method to update exchange status
ExchangeSchema.methods.updateStatus = async function(newStatus, message) {
  this.status = newStatus;
  if (message) {
    this.message = message;
  }
  return this.save();
};

const Exchange = mongoose.model('Exchange', ExchangeSchema);
module.exports = Exchange;

