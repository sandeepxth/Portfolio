const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Stat key is required'],
    unique: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Stats', StatsSchema);
