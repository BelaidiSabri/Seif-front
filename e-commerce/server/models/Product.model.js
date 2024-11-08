const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  
  numtel: { 
    type: String, 
    required: [true, 'Phone number is required'],
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  
  adresse: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true
  },
  
  communauté: { 
    type: String,
    trim: true,
    default: ''
  },
  
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  
  prix: { 
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  
  quantityDispo: { 
    type: Number,
    default: 1,
    min: [0, 'Quantity cannot be negative']
  },
  
  images: [{ 
    type: String,
    validate: {
      validator: function(v) {
        // Validate image path
        return /^\/uploads\/products\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image path!`
    }
  }],
  
  status: { 
    type: String,
    enum: {
      values: ['vente', 'don', 'echange', 'unavailable'],
      message: '{VALUE} is not a valid status'
    },
    default: 'vente'
  },
  
  categorie: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    lowercase: true
  },
  
  ville: { 
    type: String, 
    required: [true, '"ville" is required'],
    trim: true
  },
  
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: '2dsphere',
    required: [true, '"location" is required'],
    validate: {
      validator: function(v) {
        return v.length === 2 && 
               v[0] >= -180 && v[0] <= 180 && // longitude
               v[1] >= -90 && v[1] <= 90;     // latitude
      },
      message: props => `${props.value} is not a valid coordinate pair!`
    }
  },
  //badel user b seller when you make 2 roles
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },

  views: {
    type: Number,
    default: 0
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProductSchema.index({ categorie: 1 });
ProductSchema.index({ ville: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ prix: 1 });
ProductSchema.index({ user: 1 });
ProductSchema.index({ createdAt: -1 });

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function() {
  return this.prix ? `${this.prix.toFixed(2)} Dt` : '';
});

// Virtual for image URLs
ProductSchema.virtual('imageUrls').get(function() {
  return this.images.map(image => `${process.env.BASE_URL}${image}`);
});

// Instance method to increment views
ProductSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Static method to find nearby products
ProductSchema.statics.findNearby = function(coordinates, maxDistance) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Middleware to update lastUpdated timestamp
ProductSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Middleware to handle image deletion when product is deleted
ProductSchema.pre('remove', async function(next) {
  try {
    if (this.images && this.images.length > 0) {
      const fs = require('fs');
      const path = require('path');
      
      this.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", ProductSchema);

// Add text index for search functionality
Product.collection.createIndex({
  nom: 'text',
  description: 'text',
  categorie: 'text',
  ville: 'text'
});

module.exports = Product;