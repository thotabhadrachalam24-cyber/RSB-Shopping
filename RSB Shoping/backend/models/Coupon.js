const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: true
  },
  // Discount amount in paise
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // Minimum cart value in paise for the coupon to be applicable
  minCartValue: {
    type: Number,
    required: true,
    min: 0
  },
  // Maximum discount in paise
  maxDiscount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['flat', 'percentage'],
    required: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    required: true,
    min: 1
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Virtual for amounts in INR
couponSchema.virtual('discountAmountINR').get(function() {
  return (this.discountAmount / 100).toFixed(2);
});

couponSchema.virtual('minCartValueINR').get(function() {
  return (this.minCartValue / 100).toFixed(2);
});

couponSchema.virtual('maxDiscountINR').get(function() {
  return (this.maxDiscount / 100).toFixed(2);
});

module.exports = mongoose.model('Coupon', couponSchema);