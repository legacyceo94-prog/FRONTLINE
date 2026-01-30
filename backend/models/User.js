const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  businessType: {
    type: String,
    enum: ['service', 'product', 'none'],
    default: 'none'
  },
  location: {
    type: String,
    default: ''
  },
  // TRUST & COMPETENCE LAYER
  isVerified: {
    type: Boolean,
    default: false // Manually approved badge
  },
  trustScore: {
    type: Number,
    default: 0
  },
  joinedCommunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    index: true
  }],
  competence: {
    skills: [String]
  },
  sellerProfile: {
    bio: String,
    phone: String, // For WhatsApp contact
    portfolio: [{
      title: String,
      description: String,
      imageUrl: String, // Project screenshots
      link: String
    }],
    certificates: [{
      title: String,
      imageUrl: String,
      date: Date
    }]
  },
  ratings: [{
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

module.exports = mongoose.model('User', UserSchema);
