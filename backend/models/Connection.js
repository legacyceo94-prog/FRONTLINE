const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true
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

module.exports = mongoose.model('connection', ConnectionSchema);
