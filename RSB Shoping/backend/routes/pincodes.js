const express = require('express');
const Pincode = require('../models/Pincode');
const router = express.Router();

// @route   GET /api/pincodes/check/:pincode
// @desc    Check if pincode is serviceable and get delivery info
// @access  Public
router.get('/check/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pincode format. Please enter a 6-digit pincode.'
      });
    }

    // Check pincode in database
    const pincodeData = await Pincode.findOne({ pincode });

    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found in our database'
      });
    }

    res.json({
      success: true,
      data: {
        deliverable: pincodeData.isDeliverable,
        city: pincodeData.city,
        state: pincodeData.state,
        estimatedDays: pincodeData.estimatedDays
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/pincodes/autocomplete
// @desc    Get city and state suggestions based on partial pincode
// @access  Public
router.get('/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 3 digits of pincode'
      });
    }

    const pincodes = await Pincode.find({
      pincode: { $regex: `^${query}` }
    })
    .select('pincode city state')
    .limit(10);

    res.json({
      success: true,
      data: pincodes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;