const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // We will need to create this middleware
const Course = require('../models/Course');
const User = require('../models/User');

// @route   GET api/courses
// @desc    Get all courses with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, level, type, seller } = req.query;
    let query = {};

    // Filter by Category
    if (category) query.category = category;

    // Filter by Type (Product / Service)
    if (type) query.type = type;

    // Filter by Seller (Profile View)
    if (seller) query.seller = seller;

    // Search (Title or Description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by Level
    if (level) query['skuDetails.skillLevel'] = level;
    
    // Filter by Price
    if (minPrice || maxPrice) {
      query['skuDetails.price'] = {};
      if (minPrice) query['skuDetails.price'].$gte = minPrice;
      if (maxPrice) query['skuDetails.price'].$lte = maxPrice;
    }

    const courses = await Course.find(query).populate('seller', 'username isVerified trustScore sellerProfile.bio sellerProfile.phone');
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/me
// @desc    Get current user's (seller) listed assets
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const courses = await Course.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('seller', 'username isVerified trustScore sellerProfile');
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Increment View Count (Simple Analytics)
    course.analytics.views += 1;
    await course.save();

    res.json(course);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Course not found' });
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses/:id/contact
// @desc    Track contact click (analytics)
// @access  Public
router.post('/:id/contact', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    course.analytics.contactClicks += 1;
    await course.save();
    
    res.json(course.analytics);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses
// @desc    Create a new course
// @access  Private (Seller only)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      price, 
      duration, 
      skillLevel, 
      flyerImage, 
      type,
      // New Dossier Fields
      roadmap,        // Array of strings (for Services)
      stockCount,     // Number (for Products)
      specifications  // Array of {key, value} (for Products)
    } = req.body;

    // Verify Role (Source of Truth check)
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return res.status(403).json({ msg: 'Security Breach: Only professional pilots (Sellers) can broadcast new listings.' });
    }

    const newCourse = new Course({
      seller: req.user.id,
      title,
      description,
      type,
      category,
      skuDetails: {
        price,
        duration,
        skillLevel,
        roadmap: roadmap || [],
        stockCount: stockCount || 0,
        specifications: specifications || []
      },
      media: {
        flyerImage
      }
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   DELETE api/courses/:id
// @desc    Purge a listing (Asset Decommissioning)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Marketplace asset not found.' });

    // Sovereignty Check: Only the original Provider or Imperial Admin can purge
    const isAdmin = (await User.findById(req.user.id)).role === 'admin';
    const isOwner = course.seller.toString() === req.user.id;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ msg: 'Purge Denied: You do not have the clearance to decommission this asset.' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Asset Purged. Records removed from the marketplace.' });
  } catch (err) {
    console.error("Asset Purge Error:", err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
