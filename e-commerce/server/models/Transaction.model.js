const mongoose = require('mongoose');
const Product = require('./Product.model');

const TransactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
});

const TransactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer reference is required']
  },
  products: [TransactionItemSchema],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['online', 'cash'],
      message: '{VALUE} is not a valid payment method'
    },
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'failed', 'refunded'],
      message: '{VALUE} is not a valid payment status'
    },
    required: [true, 'Payment status is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
TransactionSchema.index({ buyer: 1, createdAt: -1 });
TransactionSchema.index({ 'products.seller': 1, createdAt: -1 });
TransactionSchema.index({ paymentStatus: 1 });
TransactionSchema.index({ status: 1 });

// Virtual to get sellers for this transaction
TransactionSchema.virtual('uniqueSellers').get(function() {
  return [...new Set(this.products.map(item => item.seller))];
});

// Method to calculate total amount per seller
TransactionSchema.methods.getSellerTotal = function(sellerId) {
  return this.products
    .filter(item => item.seller.toString() === sellerId.toString())
    .reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Middleware to update product quantities after successful transaction
TransactionSchema.pre('save', async function(next) {
  if (this.isNew && this.paymentStatus === 'completed') {
    try {
    //   const Product = mongoose.model('Product');
      
      await Promise.all(this.products.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
        if (product.quantityDispo < item.quantity) {
          throw new Error(`Insufficient quantity for product ${product.nom}`);
        }
        
        product.quantityDispo -= item.quantity;
        if (product.quantityDispo === 0) {
          product.status = 'unavailable';
        }
        await product.save();
      }));
    } catch (error) {
      next(error);
    }
  }
  next();
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;