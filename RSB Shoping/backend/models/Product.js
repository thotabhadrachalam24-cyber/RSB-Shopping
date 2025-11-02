const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: [{ type: String, required: true }]
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  // Price in paise (1 INR = 100 paise) to avoid floating point issues
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Price must be in paise (multiply INR by 100)'
    }
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['electronics', 'fashion', 'home', 'groceries']
  },
  images: [{
    url: String,
    publicId: String // For Cloudinary
  }],
  stockQty: {
    type: Number,
    required: true,
    min: [0, 'Stock quantity cannot be negative']
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  attributes: [attributeSchema],
  sku: {
    type: String,
    required: true,
    unique: true
  },
  // Flag for products subject to GST
  isGSTApplicable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for searching
productSchema.index({ 
  title: 'text', 
  description: 'text',
  category: 'text'
});

// Virtual for price in INR
productSchema.virtual('priceINR').get(function() {
  return (this.price / 100).toFixed(2);
});

module.exports = mongoose.model('Product', productSchema);