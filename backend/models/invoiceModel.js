const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    invoiceNo: {
      type: String,
      required: true,
      unique: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    items: [
      {
        description: { type: String, required: true },
        sacCode: { type: String, default: '' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        gstRate: { type: Number, default: 0 },
        amount: { type: Number, required: true }
      }
    ],
    subTotal: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Overdue'],
      default: 'Unpaid'
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
