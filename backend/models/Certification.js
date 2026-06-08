const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a certification title'],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, 'Please add an issuer'],
    trim: true,
  },
  date: {
    type: String, // String like 'June 2026' or Date
    required: [true, 'Please add a date'],
  },
  credentialUrl: {
    type: String,
    default: '',
  },
  image: {
    type: String, // Base64 or URL
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Certification', CertificationSchema);
