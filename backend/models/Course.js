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
    enum: ['Engineering', 'Design', 'Technology', 'Business', 'Other'],
    required: true
  },
  skuDetails: {
    price: Number,
    currency: { type: String, default: 'KES' },
    // --- SERVICE SPECS ---
    duration: String, // e.g. "4 Weeks", "10 Hours"
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
      default: 'Intermediate'
    },
    roadmap: [String], // Steps in the delivery process (1. Audit, 2. Design, etc.)
    // --- PRODUCT SPECS ---
    stockCount: { type: Number, default: 0 }, // Inventory Pulse
    specifications: [{ // Technical Ledger (e.g., Material: Carbon)
      key: String,
      value: String
    }]
  },
  media: {
    flyerImage: String,
    sampleWork: [String]
  },
  curriculum: [String],
  
  // ANALYTICS
  analytics: {
    views: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
