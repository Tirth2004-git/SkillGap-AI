const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: [true, 'Target job role is required'],
    trim: true
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  missingSkills: {
    type: [String],
    default: []
  },
  strongSkills: {
    type: [String],
    default: []
  },
  suggestions: {
    type: [String],
    default: []
  },
  roadmap: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  recommendedCourses: [
    {
      name: { type: String, required: true },
      platform: { type: String, required: true },
      url: { type: String },
      type: { type: String, enum: ['Free', 'Paid'], default: 'Free' }
    }
  ],
  summary: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
