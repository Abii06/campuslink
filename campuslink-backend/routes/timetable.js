const express = require('express');
const { body, validationResult } = require('express-validator');
const Timetable = require('../models/Timetable');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/timetable
// @desc    Get timetables
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      department, 
      year, 
      semester, 
      section,
      academicYear,
      page = 1,
      limit = 10 
    } = req.query;

    const query = { isActive: true };

    // If student, filter by their department and year
    if (req.user.role === 'student') {
      query.department = req.user.department;
      query.year = req.user.year;
    } else {
      // Admin can filter by any department/year
      if (department) query.department = department;
      if (year) query.year = parseInt(year);
    }

    if (semester) query.semester = parseInt(semester);
    if (section) query.section = section.toUpperCase();
    if (academicYear) query.academicYear = academicYear;

    // Check if timetable is currently effective
    const now = new Date();
    query.effectiveFrom = { $lte: now };
    query.effectiveTo = { $gte: now };

    const timetables = await Timetable.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Timetable.countDocuments(query);

    res.json({
      success: true,
      data: timetables,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get timetables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/timetable/:id
// @desc    Get single timetable
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    // Students can only view their department's timetable
    if (req.user.role === 'student' && 
        (timetable.department !== req.user.department || 
         timetable.year !== req.user.year)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/timetable
// @desc    Create new timetable
// @access  Admin only
router.post('/', adminAuth, [
  body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
  body('year').isInt({ min: 1, max: 4 }).withMessage('Year must be between 1-4'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1-8'),
  body('section').trim().isLength({ min: 1 }).withMessage('Section is required'),
  body('academicYear').matches(/^\d{4}-\d{4}$/).withMessage('Academic year format should be YYYY-YYYY'),
  body('effectiveFrom').isISO8601().withMessage('Valid effective from date is required'),
  body('effectiveTo').isISO8601().withMessage('Valid effective to date is required'),
  body('schedule').isArray({ min: 1 }).withMessage('Schedule is required'),
  body('schedule.*.day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']).withMessage('Invalid day'),
  body('schedule.*.periods').isArray().withMessage('Periods array is required')
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

    // Check if timetable already exists for this combination
    const existingTimetable = await Timetable.findOne({
      department: req.body.department,
      year: req.body.year,
      semester: req.body.semester,
      section: req.body.section.toUpperCase(),
      academicYear: req.body.academicYear,
      isActive: true
    });

    if (existingTimetable) {
      return res.status(400).json({
        success: false,
        message: 'Timetable already exists for this combination'
      });
    }

    const timetableData = {
      ...req.body,
      section: req.body.section.toUpperCase(),
      createdBy: req.user._id
    };

    const timetable = new Timetable(timetableData);
    await timetable.save();

    await timetable.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Timetable created successfully',
      data: timetable
    });
  } catch (error) {
    console.error('Create timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/timetable/:id
// @desc    Update timetable
// @access  Admin only
router.put('/:id', adminAuth, [
  body('department').optional().trim().isLength({ min: 1 }),
  body('year').optional().isInt({ min: 1, max: 4 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('section').optional().trim().isLength({ min: 1 }),
  body('effectiveFrom').optional().isISO8601(),
  body('effectiveTo').optional().isISO8601(),
  body('schedule').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updateData = { ...req.body, lastModified: new Date() };
    if (updateData.section) {
      updateData.section = updateData.section.toUpperCase();
    }

    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable
    });
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete timetable
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    console.error('Delete timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/timetable/my/current
// @desc    Get current user's timetable
// @access  Private (Students only)
router.get('/my/current', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is for students only'
      });
    }

    const now = new Date();
    const timetable = await Timetable.findOne({
      department: req.user.department,
      year: req.user.year,
      isActive: true,
      effectiveFrom: { $lte: now },
      effectiveTo: { $gte: now }
    }).populate('createdBy', 'name email');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'No active timetable found for your class'
      });
    }

    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Get current timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/timetable/departments/list
// @desc    Get list of departments with timetables
// @access  Admin only
router.get('/departments/list', adminAuth, async (req, res) => {
  try {
    const departments = await Timetable.distinct('department');
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;