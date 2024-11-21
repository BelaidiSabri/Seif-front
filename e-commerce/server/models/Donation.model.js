const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Donated product is required']
  },
  donatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donating user is required']
  },
  donatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient user is required']
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
DonationSchema.index({ product: 1 });
DonationSchema.index({ donatedBy: 1 });
DonationSchema.index({ donatedTo: 1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ createdAt: -1 });

// Middleware to update lastUpdated timestamp
DonationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Validate that users are different
DonationSchema.pre('save', async function(next) {
  if (this.donatedBy.toString() === this.donatedTo.toString()) {
    next(new Error('Cannot donate to yourself'));
  }
  next();
});

// Method to update donation status
DonationSchema.methods.updateStatus = async function(newStatus, message) {
  this.status = newStatus;
  if (message) {
    this.message = message;
  }
  return this.save();
};

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;

