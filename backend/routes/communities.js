const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Community = require('../models/Community');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/communities
// @desc    Create a community
// @access  Private
router.post(
  '/',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
        return res.status(403).json({ msg: 'Territory Launch Denied: Only professional pilots (Sellers) can initialize new Hubs.' });
      }

      const { name, description, category, image } = req.body;
      const newCommunity = new Community({
        name,
        description,
        category,
        image,
        members: [req.user.id], // Creator is the first member
        creator: req.user.id
      });

      const community = await newCommunity.save();
      
      // Also add to User's joined list
      user.joinedCommunities.push(community.id);
      await user.save();

      res.json(community);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/communities/me
// @desc    Get communities created by logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const communities = await Community.find({ creator: req.user.id });
    res.json(communities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find().select('-posts');
    res.json(communities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/communities/global/posts
// @desc    Get latest posts from ALL communities (Global Feed)
// @access  Public
router.get('/global/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'username role isVerified sellerProfile')
      .populate('community', 'name image')
      .populate('comments.author', 'username profileImage isVerified');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate('creator', 'username');
    if (!community) return res.status(404).json({ msg: 'Community not found' });
    res.json(community);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Community not found' });
    res.status(500).send('Server Error');
  }
});

// @route   GET api/communities/:id/posts
// @desc    Get posts for a community
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ community: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username role isVerified sellerProfile')
      .populate('comments.author', 'username profileImage isVerified');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/communities/:id/posts
// @desc    Create a post in a community
router.post('/:id/posts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return res.status(403).json({ msg: 'Broadcast Restricted: Only verified Sellers can pilot new posts in this territory.' });
    }

    const { title, content, type, price, media, tier, category } = req.body; // media is array of URLs
 
     const newPost = new Post({
       title,
       content,
       type: type || 'discussion',
       price: price ? { amount: price } : undefined, // simple price structure for now
       media,
       tier: tier || 'standard',
       category: category || 'General',
       community: req.params.id,
       author: req.user.id
     });

    const post = await newPost.save();

    // Add to community's post list
    const community = await Community.findById(req.params.id);
    community.posts.push(post.id);
    await community.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST api/communities/:id/join
// @desc    Join a community
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    const user = await User.findById(req.user.id);
    if (user.joinedCommunities.includes(req.params.id)) {
      return res.status(400).json({ msg: 'Already a member' });
    }

    community.members.push(req.user.id);
    user.joinedCommunities.push(req.params.id);

    await community.save();
    await user.save();

    res.json({ msg: 'Joined successfully', memberCount: community.members.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/communities/:id/membership
// @desc    Check if logged in user is member
router.get('/:id/membership', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isMember = user.joinedCommunities.includes(req.params.id);
    res.json({ isMember });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/communities/:id
// @desc    Update community details
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  try {
    let community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    // Verify ownership or admin
    if (community.creator?.toString() !== req.user.id) {
       // Also check user role for admin (optional)
       const user = await User.findById(req.user.id);
       if (user.role !== 'admin') {
         return res.status(403).json({ msg: 'Not authorized to edit this community' });
       }
    }

    const { name, description, category, image } = req.body;
    if (name) community.name = name;
    if (description) community.description = description;
    if (category) community.category = category;
    if (image) community.image = image;

    await community.save();
    res.json(community);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/communities/posts/:id/comment
// @desc    Add a comment to a post
router.post('/posts/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Comment text is required' });

    post.comments.push({
      author: req.user.id,
      text
    });

    await post.save();
    
    // Return post with populated comments
    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.author', 'username profileImage isVerified');
    
    res.json(updatedPost.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
