const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },
    gst: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
