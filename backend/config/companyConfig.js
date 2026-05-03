require('dotenv').config();

const companyConfig = {
  name: process.env.COMPANY_NAME || 'My Company',
  logoUrl: process.env.COMPANY_LOGO_URL || '',
  tagline: process.env.COMPANY_TAGLINE || '',

  address: {
    line1: process.env.COMPANY_ADDRESS_LINE1 || '',
    line2: process.env.COMPANY_ADDRESS_LINE2 || '',
    state: process.env.COMPANY_ADDRESS_STATE || '',
    pincode: process.env.COMPANY_ADDRESS_PINCODE || '',
    full: [
      process.env.COMPANY_ADDRESS_LINE1,
      process.env.COMPANY_ADDRESS_LINE2,
      process.env.COMPANY_ADDRESS_STATE,
      process.env.COMPANY_ADDRESS_PINCODE,
    ].filter(Boolean).join(', '),
  },

  tax: {
    gst: process.env.COMPANY_GST || '',
    pan: process.env.COMPANY_PAN || '',
  },

  bank: {
    accountNo: process.env.COMPANY_BANK_ACCOUNT_NO || '',
    ifsc: process.env.COMPANY_BANK_IFSC || '',
    name: process.env.COMPANY_BANK_NAME || '',
    branch: process.env.COMPANY_BANK_BRANCH || '',
    upiId: process.env.COMPANY_UPI_ID || '',
  },

  contact: {
    phone: process.env.COMPANY_PHONE || '',
    email: process.env.COMPANY_EMAIL || '',
    website: process.env.COMPANY_WEBSITE || '',
  },

  branding: {
    primaryColor: process.env.COMPANY_PRIMARY_COLOR || '#000000',
    invoicePrefix: process.env.COMPANY_INVOICE_PREFIX || 'IN',
  },

  disclaimer: (process.env.COMPANY_INVOICE_DISCLAIMER || '')
    .replace('{COMPANY_NAME}', process.env.COMPANY_NAME || 'My Company'),
};

module.exports = companyConfig;
