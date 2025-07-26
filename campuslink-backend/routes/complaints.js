
const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint by ID
// @access  Private (students can delete their own, admins can delete any)
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    // Only allow owner or admin to delete
    if (req.user.role !== 'admin' && String(complaint.submittedBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this complaint' });
    }
    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/complaints
// @desc    Get complaints
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      priority,
      search,
      my = false 
    } = req.query;

    const query = {};

    // If student, show only their complaints unless admin
    if (req.user.role === 'student' || my === 'true') {
      query.submittedBy = req.user._id;
    }

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email studentId department')
      .populate('assignedTo', 'name email')
      .populate('adminResponse.respondedBy', 'name email')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email studentId department')
      .populate('assignedTo', 'name email')
      .populate('adminResponse.respondedBy', 'name email')
      .populate('comments.user', 'name')
      .populate('upvotes.user', 'name');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check access rights
    if (req.user.role === 'student' && 
        complaint.submittedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/complaints
// @desc    Create new complaint
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required (max 1000 chars)'),
  body('category').isIn(['infrastructure', 'food', 'transport', 'academic', 'hostel', 'library', 'sports', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('location').optional().trim().isLength({ max: 100 }),
  body('isAnonymous').optional().isBoolean()
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

    const complaintData = {
      ...req.body,
      submittedBy: req.user._id
    };

    const complaint = new Complaint(complaintData);
    await complaint.save();

    await complaint.populate('submittedBy', 'name email studentId department');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (Admin only)
// @access  Admin
router.put('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'in-progress', 'resolved', 'rejected']).withMessage('Invalid status'),
  body('adminResponse').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status, adminResponse } = req.body;
    const updateData = { status };

    if (adminResponse) {
      updateData.adminResponse = {
        message: adminResponse,
        respondedBy: req.user._id,
        respondedAt: new Date()
      };
    }

    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('submittedBy', 'name email')
     .populate('adminResponse.respondedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/complaints/:id/upvote
// @desc    Upvote complaint
// @access  Private
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const existingUpvote = complaint.upvotes.find(
      upvote => upvote.user.toString() === req.user._id.toString()
    );

    if (existingUpvote) {
      // Remove upvote
      complaint.upvotes = complaint.upvotes.filter(
        upvote => upvote.user.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote
      complaint.upvotes.push({ user: req.user._id });
    }

    await complaint.save();

    res.json({
      success: true,
      message: existingUpvote ? 'Upvote removed' : 'Complaint upvoted',
      upvotesCount: complaint.upvotes.length
    });
  } catch (error) {
    console.error('Upvote complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/complaints/:id/comments
// @desc    Add comment to complaint
// @access  Private
router.post('/:id/comments', auth, [
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Comment is required (max 500 chars)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.comments.push({
      user: req.user._id,
      message: req.body.message
    });

    await complaint.save();
    await complaint.populate('comments.user', 'name');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: complaint.comments[complaint.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/complaints/stats/overview
// @desc    Get complaint statistics (Admin only)
// @access  Admin
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });

    // Category wise stats
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Priority wise stats
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          pendingComplaints,
          resolvedComplaints,
          inProgressComplaints
        },
        categoryStats,
        priorityStats
      }
    });
  } catch (error) {
    console.error('Get complaint stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;