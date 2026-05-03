const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // One user, one business profile
    },
    name: { type: String, default: 'My Company' },
    logoUrl: { type: String, default: '' },
    tagline: { type: String, default: '' },
    
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      full: { type: String, default: '' }
    },
    
    tax: {
      gst: { type: String, default: '' },
      pan: { type: String, default: '' }
    },
    
    bank: {
      accountNo: { type: String, default: '' },
      ifsc: { type: String, default: '' },
      name: { type: String, default: '' },
      branch: { type: String, default: '' },
      upiId: { type: String, default: '' }
    },
    
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' }
    },
    
    branding: {
      primaryColor: { type: String, default: '#000000' },
      invoicePrefix: { type: String, default: 'IN' }
    },
    
    disclaimer: { type: String, default: 'This invoice is prepared by {COMPANY_NAME}. For any discrepancy, kindly connect within 24 hours from the date of generation.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
