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
    const { category, search, minPrice, maxPrice, level } = req.query;
    let query = {};

    // Filter by Category
    if (category) query.category = category;

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
    // TODO: Verify user is a seller?
    const { title, description, category, price, duration, skillLevel, flyerImage, curriculum, type } = req.body;

    const newCourse = new Course({
      seller: req.user.id,
      title,
      description,
      type, // Divergent identity
      category,
      skuDetails: {
        price,
        duration,
        skillLevel
      },
      media: {
        flyerImage
      },
      curriculum
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
