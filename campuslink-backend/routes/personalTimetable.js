const express = require('express');
const { body, validationResult } = require('express-validator');
const PersonalTimetable = require('../models/PersonalTimetable');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/personal-timetable
// @desc    Get user's personal timetable
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('🔍 Personal Timetable GET - User:', req.user ? req.user.email : 'No user');
    
    let timetable = await PersonalTimetable.findOne({ userId: req.user._id });
    
    if (!timetable) {
      // Create empty timetable if doesn't exist
      timetable = new PersonalTimetable({
        userId: req.user._id,
        schedule: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: []
        }
      });
      await timetable.save();
      console.log('✅ Created new empty timetable for user');
    }

    res.json({
      success: true,
      data: timetable.schedule
    });
  } catch (error) {
    console.error('❌ Get personal timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/personal-timetable
// @desc    Update user's personal timetable
// @access  Private
router.put('/', auth, [
  body('schedule').isObject().withMessage('Schedule must be an object'),
  body('schedule.Monday').optional().isArray().withMessage('Monday schedule must be an array'),
  body('schedule.Tuesday').optional().isArray().withMessage('Tuesday schedule must be an array'),
  body('schedule.Wednesday').optional().isArray().withMessage('Wednesday schedule must be an array'),
  body('schedule.Thursday').optional().isArray().withMessage('Thursday schedule must be an array'),
  body('schedule.Friday').optional().isArray().withMessage('Friday schedule must be an array'),
  body('schedule.Saturday').optional().isArray().withMessage('Saturday schedule must be an array')
], async (req, res) => {
  try {
    console.log('🔍 Personal Timetable PUT - User:', req.user ? req.user.email : 'No user');
    console.log('🔍 Personal Timetable PUT - Received data:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { schedule } = req.body;

    // Validate each class in the schedule
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (const day of days) {
      if (schedule[day]) {
        for (const classItem of schedule[day]) {
          if (!classItem.id || !classItem.subject || !classItem.instructor || 
              !classItem.room || !classItem.startTime || !classItem.endTime || !classItem.color) {
            return res.status(400).json({
              success: false,
              message: `Invalid class data for ${day}. All fields are required.`
            });
          }
          
          // Validate time format
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(classItem.startTime) || !timeRegex.test(classItem.endTime)) {
            return res.status(400).json({
              success: false,
              message: `Invalid time format for ${day}. Use HH:MM format.`
            });
          }
          
          // Validate color format
          const colorRegex = /^#[0-9A-F]{6}$/i;
          if (!colorRegex.test(classItem.color)) {
            return res.status(400).json({
              success: false,
              message: `Invalid color format for ${day}. Use hex color format (#RRGGBB).`
            });
          }
        }
      }
    }

    console.log('✅ Validation passed, updating timetable...');

    let timetable = await PersonalTimetable.findOne({ userId: req.user._id });
    
    if (!timetable) {
      // Create new timetable
      timetable = new PersonalTimetable({
        userId: req.user._id,
        schedule
      });
      console.log('📝 Creating new timetable');
    } else {
      // Update existing timetable
      timetable.schedule = schedule;
      console.log('📝 Updating existing timetable');
    }

    await timetable.save();
    console.log('✅ Timetable saved successfully');

    res.json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable.schedule
    });
  } catch (error) {
    console.error('❌ Update personal timetable error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
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

// @route   DELETE /api/personal-timetable
// @desc    Delete user's personal timetable
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    console.log('🔍 Personal Timetable DELETE - User:', req.user ? req.user.email : 'No user');
    
    await PersonalTimetable.findOneAndDelete({ userId: req.user._id });
    
    res.json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete personal timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;