const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['service', 'product'],
    default: 'service'
  },
  category: {
    type: String,
    enum: ['Engineering', 'Design', 'Technology', 'Business', 'Other'], // As requested
    required: true
  },
  skuDetails: {
    price: Number,
    currency: { type: String, default: 'KES' },
    duration: String, // e.g. "4 Weeks", "10 Hours"
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels'
    }
  },
  media: {
    flyerImage: String, // The specific flyer with pricing
    sampleWork: [String] // Array of images/videos
  },
  curriculum: [String], // List of topics covered
  
  // ANALYTICS
  analytics: {
    views: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 } // "How many clicked contact"
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
