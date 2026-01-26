const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Engineering', 'Technology', 'Business', 'Creative', 'General'],
    default: 'General'
  },
  // The 'Network' Layer
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Posts or 'Listings' within this community
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // We will create this model next
  }],
  image: String, // Icon/Cover for the community
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Community', CommunitySchema);
