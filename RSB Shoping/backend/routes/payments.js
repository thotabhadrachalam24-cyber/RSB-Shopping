const express = require('express');
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const { formatForRazorpay } = require('../utils/formatCurrency');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payments/razorpay/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/razorpay/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    // Amount should be in paise
    if (!Number.isInteger(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be in paise (multiply INR by 100)'
      });
    }

    const options = {
      amount: formatForRazorpay(amount),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/payments/razorpay/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/razorpay/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Optional: Paytm Integration Scaffold
router.post('/paytm/initiate', auth, (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Paytm integration coming soon'
  });
});

module.exports = router;