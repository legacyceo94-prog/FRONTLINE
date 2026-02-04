const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Connection = require('../models/Connection');

// @route   POST api/connections
// @desc    Initialize a Sync Protocol (Handshake log)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { sellerId, itemId, purpose } = req.body;

  try {
    const newConnection = new Connection({
      buyer: req.user.id,
      seller: sellerId,
      item: itemId,
      purpose
    });

    const connection = await newConnection.save();
    res.json(connection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/connections/me
// @desc    Get current user's (seller) incoming handshakes
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const connections = await Connection.find({ seller: req.user.id })
      .populate('buyer', 'username profileImage email')
      .populate('item', 'title')
      .sort({ createdAt: -1 });
    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/connections/vanguard
// @desc    Get all connections for Vanguard oversight
// @access  Public (Should be admin/vanguard protected)
router.get('/vanguard', async (req, res) => {
  try {
    const connections = await Connection.find()
      .populate('buyer', 'username')
      .populate('seller', 'username')
      .populate('item', 'title')
      .sort({ createdAt: -1 });
    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
