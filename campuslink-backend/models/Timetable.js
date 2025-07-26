const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    uppercase: true
  },
  schedule: [{
    day: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    periods: [{
      periodNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 8
      },
      startTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
      },
      endTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
      },
      subject: {
        code: {
          type: String,
          required: true,
          trim: true,
          uppercase: true
        },
        name: {
          type: String,
          required: true,
          trim: true
        },
        credits: {
          type: Number,
          min: 1,
          max: 6
        }
      },
      faculty: {
        name: {
          type: String,
          required: true,
          trim: true
        },
        email: String,
        phone: String
      },
      room: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        enum: ['lecture', 'lab', 'tutorial', 'seminar'],
        default: 'lecture'
      },
      isBreak: {
        type: Boolean,
        default: false
      }
    }]
  }],
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Academic year format should be YYYY-YYYY']
  },
  effectiveFrom: {
    type: Date,
    required: [true, 'Effective from date is required']
  },
  effectiveTo: {
    type: Date,
    required: [true, 'Effective to date is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique timetable per department, year, semester, section
timetableSchema.index({ 
  department: 1, 
  year: 1, 
  semester: 1, 
  section: 1, 
  academicYear: 1 
}, { unique: true });

// Index for better querying
timetableSchema.index({ department: 1, year: 1 });
timetableSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);