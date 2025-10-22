const mongoose = require('mongoose');

/**
 * Video Schema
 * Represents a saved video with metadata fetched from YouTube
 * Enhanced with AI analysis capabilities for workout tracking
 */
const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  // AI Analysis fields
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  segments: [{
    timestamp: {
      type: Number,
      required: true
    },
    exerciseName: {
      type: String,
      required: true
    },
    targetMuscles: [String]
  }],
  analysisError: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);

