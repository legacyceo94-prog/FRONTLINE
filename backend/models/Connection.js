const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['Course', 'Post'],
    default: 'Course'
  },
  purpose: {
    type: String,
    enum: ['Purchase', 'Inquiry', 'Technical Support', 'Custom Request'],
    default: 'Inquiry'
  },
  status: {
    type: String,
    enum: ['pending', 'connected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Connection', ConnectionSchema);
