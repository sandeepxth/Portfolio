const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a project description'],
  },
  techStack: {
    type: [String],
    required: [true, 'Please add at least one technology'],
  },
  features: {
    type: [String],
    default: [],
  },
  image: {
    type: String, // Base64 or URL
    default: '',
  },
  githubUrl: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
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

module.exports = mongoose.model('Project', ProjectSchema);
