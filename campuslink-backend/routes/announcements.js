const express = require('express');
const { body, validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      priority, 
      search,
      department,
      year 
    } = req.query;

    const query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter by department (if user is student)
    if (req.user.role === 'student') {
      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: 'students' },
        { departments: { $in: [req.user.department] } },
        { years: { $in: [req.user.year] } }
      ];
    }

    // Additional filters
    if (department) {
      query.departments = { $in: [department] };
    }

    if (year) {
      query.years = { $in: [parseInt(year)] };
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Check for expired announcements
    const now = new Date();
    query.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: now } }
    ];

    const announcements = await Announcement.find(query)
      .populate('author', 'name email role')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email role')
      .populate('likes.user', 'name');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Increment views
    announcement.views += 1;
    await announcement.save();

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Admin only
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content is required (max 1000 chars)'),
  body('category').isIn(['academic', 'event', 'general', 'urgent', 'sports', 'cultural']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('targetAudience').optional().isArray(),
  body('departments').optional().isArray(),
  body('years').optional().isArray(),
  body('expiryDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const announcementData = {
      ...req.body,
      author: req.user._id
    };

    const announcement = new Announcement(announcementData);
    await announcement.save();

    await announcement.populate('author', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Admin only
router.put('/:id', adminAuth, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('content').optional().trim().isLength({ min: 1, max: 1000 }),
  body('category').optional().isIn(['academic', 'event', 'general', 'urgent', 'sports', 'cultural']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('expiryDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email role');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/announcements/:id/like
// @desc    Like/Unlike announcement
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    const existingLike = announcement.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike
      announcement.likes = announcement.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      announcement.likes.push({ user: req.user._id });
    }

    await announcement.save();

    res.json({
      success: true,
      message: existingLike ? 'Announcement unliked' : 'Announcement liked',
      likesCount: announcement.likes.length
    });
  } catch (error) {
    console.error('Like announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;