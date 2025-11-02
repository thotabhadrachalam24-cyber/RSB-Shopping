const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  images: [{
    url: String,
    publicId: String // For Cloudinary
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating when review is added/updated/removed
reviewSchema.statics.updateProductRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  await mongoose.model('Product').findByIdAndUpdate(productId, {
    'rating.average': stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0,
    'rating.count': stats.length > 0 ? stats[0].count : 0
  });
};

reviewSchema.post('save', function() {
  this.constructor.updateProductRating(this.product);
});

reviewSchema.post('remove', function() {
  this.constructor.updateProductRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);