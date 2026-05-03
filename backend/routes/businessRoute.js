const express = require('express');
const router = express.Router();
const Business = require('../models/businessModel');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Get authenticated user's business profile
router.get('/', async (req, res) => {
  try {
    let business = await Business.findOne({ user: req.user._id });
    
    // If no business profile exists yet, return a null/empty indication
    if (!business) {
      return res.status(200).json({ success: true, data: null });
    }

    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update business profile
router.put('/', async (req, res) => {
  try {
    let business = await Business.findOne({ user: req.user._id });

    if (business) {
      // Update existing
      business.name = req.body.name || business.name;
      business.logoUrl = req.body.logoUrl !== undefined ? req.body.logoUrl : business.logoUrl;
      business.tagline = req.body.tagline !== undefined ? req.body.tagline : business.tagline;
      business.address = { ...business.address, ...req.body.address };
      business.tax = { ...business.tax, ...req.body.tax };
      business.bank = { ...business.bank, ...req.body.bank };
      business.contact = { ...business.contact, ...req.body.contact };
      business.branding = { ...business.branding, ...req.body.branding };
      business.disclaimer = req.body.disclaimer !== undefined ? req.body.disclaimer : business.disclaimer;

      const updatedBusiness = await business.save();
      return res.json({ success: true, data: updatedBusiness });
    } else {
      // Create new
      const newBusiness = new Business({
        user: req.user._id,
        name: req.body.name,
        logoUrl: req.body.logoUrl,
        tagline: req.body.tagline,
        address: req.body.address,
        tax: req.body.tax,
        bank: req.body.bank,
        contact: req.body.contact,
        branding: req.body.branding,
        disclaimer: req.body.disclaimer
      });

      const createdBusiness = await newBusiness.save();
      return res.status(201).json({ success: true, data: createdBusiness });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
