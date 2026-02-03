const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// @route   GET api/users
// @desc    Get all users overview (Admin/Vanguard)
// @access  Public (Should be protected in production)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:id
// @desc    Get user profile by ID (public info)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('joinedCommunities', 'name image')
      .populate('ratings.author', 'username profileImage isVerified');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Calculate Dynamic Trust Score (The Systematic Algorithm)
    const postCount = await Post.countDocuments({ author: req.params.id });
    const commCount = user.joinedCommunities.length;
    const avgRating = user.averageRating || 0;
    
    // Calibrated for 'Diamond' Difficulty:
    // - Asset Weight: 0.1 (High volume required)
    // - Network Weight: 0.1 (Participation required)
    // - Handshake Weight: 2 (Client validation dominates)
    let calculatedScore = (postCount * 0.1) + (commCount * 0.1) + (avgRating * 2);
    if (calculatedScore > 99) calculatedScore = 99;
    
    const userObj = user.toObject();
    userObj.trustScore = calculatedScore;

    res.json(userObj);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:id/posts
// @desc    Get posts by a specific user (their timeline)
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('community', 'name')
      .populate('comments.author', 'username profileImage isVerified'); // Added for dashboard insight
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/users/:id/upgrade-seller
// @desc    Upgrade user to seller role
// @access  Private
router.patch('/:id/upgrade-seller', auth, async (req, res) => {
  try {
    // Verify the user is upgrading their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if already a seller
    if (user.role === 'seller' || user.role === 'admin') {
      return res.status(400).json({ msg: 'Already a seller or admin' });
    }

    // Upgrade to seller
    user.role = 'seller';
    await user.save();

    res.json({ msg: 'Successfully upgraded to seller', role: 'seller' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/:id/portfolio
// @desc    Add item to seller portfolio
// @access  Private
router.post('/:id/portfolio', auth, async (req, res) => {
  try {
    // Verify the user is editing their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(400).json({ msg: 'Must be a seller to add portfolio' });
    }

    const { title, description, imageUrl, link } = req.body;
    
    user.sellerProfile.portfolio.push({
      title,
      description,
      imageUrl,
      link
    });

    await user.save();
    res.json(user.sellerProfile.portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/users/:id
// @desc    Update user profile info (bio, phone)
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
       return res.status(403).json({ msg: 'Not authorized' });
    }

    const { bio, phone, location } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (bio !== undefined) user.sellerProfile.bio = bio;
    if (phone !== undefined) user.sellerProfile.phone = phone;
    if (location !== undefined) user.location = location;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user account
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Verify the user is deleting their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const Community = require('../models/Community');

    // 1. Find all posts by this user to clean their references in Communities
    const userPosts = await Post.find({ author: req.params.id });
    const postIds = userPosts.map(p => p._id);

    // 2. Clear user posts from Community post arrays (Fixes slow loading/broken refs)
    await Community.updateMany(
      { posts: { $in: postIds } },
      { $pull: { posts: { $in: postIds } } }
    );

    // 3. Delete all posts by this user
    await Post.deleteMany({ author: req.params.id });

    // 4. Scrub User Comments from ALL other posts in the network
    await Post.updateMany(
      { "comments.author": req.params.id },
      { $pull: { comments: { author: req.params.id } } }
    );

    // 5. Remove user from all communities memberships
    await Community.updateMany(
      { members: req.params.id },
      { $pull: { members: req.params.id } }
    );

    // 6. Handle Communities created by this user (Full data wipe requested)
    await Community.deleteMany({ creator: req.params.id });

    // 7. Finally, Delete the User identity
    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Clean Slate achieved. All professional data successfully wiped.' });
  } catch (err) {
    console.error("Deep Wipe Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/:id/rate
// @desc    Rate a seller (systematic trust contribution)
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { stars, comment } = req.body;
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ msg: 'Valid star rating (1-5) required' });
    }

    const seller = await User.findById(req.params.id);
    if (!seller) return res.status(404).json({ msg: 'Seller not found' });

    // Prevent rating oneself
    if (req.user.id === req.params.id) {
       return res.status(400).json({ msg: 'Cannot rate your own cockpit' });
    }

    // Check if already rated (One Handshake = One Vote)
    const alreadyRated = seller.ratings.find(r => r.author.toString() === req.user.id);
    if (alreadyRated) {
      return res.status(400).json({ msg: 'You have already validated this expert. Trust is established.' });
    }

    // Add rating
    seller.ratings.push({
      stars,
      comment,
      author: req.user.id
    });

    // Recalculate Average Rating
    const totalStars = seller.ratings.reduce((acc, r) => acc + r.stars, 0);
    seller.averageRating = totalStars / seller.ratings.length;

    await seller.save();

    res.json({ averageRating: seller.averageRating, count: seller.ratings.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/vanguard/analytics
// @desc    Deep-dive analytics for the Publisher (Commanders, WA contacts, Friction)
// @access  Public (Should be admin-protected in production)
router.get('/vanguard/analytics', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const Community = require('../models/Community');
    const communities = await Community.find().populate('creator', 'username email sellerProfile');
    
    // Extract Hub Commanders (Sellers with Hubs)
    const commanders = communities.map(c => ({
      hub: c.name,
      commander: c.creator?.username || 'Unknown',
      whatsapp: c.creator?.sellerProfile?.phone || 'No Sync',
      email: c.creator?.email || 'N/A'
    }));

    // Extract Friction Points (Ratings <= 2 stars)
    const frictionPoints = users.reduce((acc, user) => {
      const negativeRatings = user.ratings
        .filter(r => r.stars <= 2)
        .map(r => ({
          targetUser: user.username,
          stars: r.stars,
          comment: r.comment,
          whatsapp: user.sellerProfile?.phone || 'No Sync',
          date: r.createdAt
        }));
      return [...acc, ...negativeRatings];
    }, []);

    res.json({
      commanders,
      frictionPoints,
      totalUsers: users.length,
      totalHubs: communities.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
