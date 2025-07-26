const express = require('express');
const { body, validationResult } = require('express-validator');
const LostFound = require('../models/LostFound');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lost-found
// @desc    Get lost and found items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category, 
      status,
      search,
      my = false 
    } = req.query;

    const query = { status: { $ne: 'expired' } };

    // If user wants only their items
    if (my === 'true') {
      query.submittedBy = req.user._id;
    }

    // Filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    const items = await LostFound.find(query)
      .populate('submittedBy', 'name email phone')
      .populate('claimedBy.user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LostFound.countDocuments(query);

    res.json({
      success: true,
      data: items,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get lost found items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/lost-found/:id
// @desc    Get single lost/found item
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id)
      .populate('submittedBy', 'name email phone')
      .populate('claimedBy.user', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get lost found item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/lost-found
// @desc    Create new lost/found item
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required (max 500 chars)'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('category').isIn(['electronics', 'books', 'clothing', 'accessories', 'documents', 'keys', 'bags', 'other']).withMessage('Invalid category'),
  body('itemName').trim().isLength({ min: 1, max: 50 }).withMessage('Item name is required (max 50 chars)'),
  body('location').trim().isLength({ min: 1, max: 100 }).withMessage('Location is required (max 100 chars)'),
  body('dateTime').isISO8601().withMessage('Valid date and time is required'),
  body('contactInfo.phone').optional().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('contactInfo.email').optional().isEmail().withMessage('Valid email required'),
  body('brand').optional().trim().isLength({ max: 30 }),
  body('color').optional().trim().isLength({ max: 20 }),
  body('isReward').optional().isBoolean(),
  body('rewardAmount').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    console.log('🔍 Lost Found POST - Received data:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Lost Found POST - User:', req.user ? req.user.email : 'No user');
    console.log('🔍 Lost Found POST - User ID:', req.user ? req.user._id : 'No user ID');
    console.log('🔍 Lost Found POST - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    console.log('✅ Validation passed, creating item...');
    
    const itemData = {
      ...req.body,
      submittedBy: req.user._id
    };
    console.log('📝 Item data prepared:', JSON.stringify(itemData, null, 2));

    // Set default contact info if not provided
    if (!itemData.contactInfo) {
      itemData.contactInfo = {};
    }
    if (!itemData.contactInfo.email) {
      itemData.contactInfo.email = req.user.email;
    }
    if (!itemData.contactInfo.phone && req.user.phone) {
      itemData.contactInfo.phone = req.user.phone;
    }
    console.log('📧 Contact info set:', itemData.contactInfo);

    console.log('💾 Creating LostFound instance...');
    const item = new LostFound(itemData);
    
    console.log('💾 Saving to database...');
    await item.save();
    console.log('✅ Item saved successfully');

    console.log('👤 Populating user data...');
    await item.populate('submittedBy', 'name email phone');
    console.log('✅ User data populated');

    res.status(201).json({
      success: true,
      message: 'Item posted successfully',
      data: item
    });
  } catch (error) {
    console.error('❌ Create lost found item error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Request body:', JSON.stringify(req.body, null, 2));
    console.error('❌ User:', req.user ? req.user.email : 'No user');
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/lost-found/:id
// @desc    Update lost/found item
// @access  Private (Owner only)
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 1, max: 500 }),
  body('location').optional().trim().isLength({ min: 1, max: 100 }),
  body('contactInfo.phone').optional().matches(/^[0-9]{10}$/),
  body('contactInfo.email').optional().isEmail(),
  body('status').optional().isIn(['active', 'claimed', 'returned', 'expired'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns this item
    if (item.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedItem = await LostFound.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email phone');

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update lost found item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/lost-found/:id/claim
// @desc    Claim a lost/found item
// @access  Private
router.post('/:id/claim', auth, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Item is not available for claiming'
      });
    }

    if (item.submittedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item'
      });
    }

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    item.claimedBy = {
      user: req.user._id,
      claimedAt: new Date(),
      verificationCode
    };
    item.status = 'claimed';

    await item.save();
    await item.populate('submittedBy', 'name email phone');
    await item.populate('claimedBy.user', 'name email');

    res.json({
      success: true,
      message: 'Item claimed successfully. Contact the owner with verification code.',
      data: {
        item,
        verificationCode
      }
    });
  } catch (error) {
    console.error('Claim item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/lost-found/:id/verify
// @desc    Verify and complete item return
// @access  Private (Owner only)
router.post('/:id/verify', auth, [
  body('verificationCode').trim().isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns this item
    if (item.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (item.status !== 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Item is not in claimed status'
      });
    }

    if (item.claimedBy.verificationCode !== req.body.verificationCode.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    item.status = 'returned';
    await item.save();

    res.json({
      success: true,
      message: 'Item return verified successfully',
      data: item
    });
  } catch (error) {
    console.error('Verify item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/lost-found/:id
// @desc    Delete lost/found item
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns this item
    if (item.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await LostFound.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete lost found item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;