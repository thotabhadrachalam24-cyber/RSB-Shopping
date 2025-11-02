const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  // Price at time of order (in paise)
  price: {
    type: Number,
    required: true
  }
});

const orderStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  comment: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid Indian pincode']
    }
  },
  // All amounts in paise
  subtotal: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'paytm'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    orderId: String, // Payment gateway order ID
    paymentId: String, // Payment gateway payment ID
    signature: String // For verification
  },
  status: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Placed'
  },
  statusHistory: [orderStatusSchema],
  estimatedDeliveryDays: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for amounts in INR
orderSchema.virtual('totalINR').get(function() {
  return (this.total / 100).toFixed(2);
});

orderSchema.virtual('subtotalINR').get(function() {
  return (this.subtotal / 100).toFixed(2);
});

orderSchema.virtual('gstINR').get(function() {
  return (this.gst / 100).toFixed(2);
});

orderSchema.virtual('shippingFeeINR').get(function() {
  return (this.shippingFee / 100).toFixed(2);
});

module.exports = mongoose.model('Order', orderSchema);