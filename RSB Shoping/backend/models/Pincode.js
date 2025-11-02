const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Indian pincode validation (6 digits)
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian pincode!`
    }
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  // Whether we deliver to this pincode
  isDeliverable: {
    type: Boolean,
    default: true
  },
  // Estimated delivery days for this pincode
  estimatedDays: {
    type: Number,
    required: true,
    min: 1,
    max: 14
  }
});

// Index for faster lookups
pincodeSchema.index({ pincode: 1 });

module.exports = mongoose.model('Pincode', pincodeSchema);