const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // 'Competence' Proof
  media: [String], // Images/Videos of work
  // Type: Is this a "Product", "Service", or just "Content"?
  type: {
    type: String,
    enum: ['service', 'product', 'discussion'],
    default: 'discussion'
  },
  price: {
    amount: Number,
    currency: {
      type: String,
      default: 'KES'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Post', PostSchema);
