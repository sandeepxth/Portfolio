const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    default: 'resume.pdf'
  },
  fileData: {
    type: String, // Base64 encoded string representing the PDF
    required: [true, 'Resume file data is required']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
