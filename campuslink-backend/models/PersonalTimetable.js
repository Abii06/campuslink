const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor is required'],
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  room: {
    type: String,
    required: [true, 'Room is required'],
    trim: true,
    maxlength: [50, 'Room cannot exceed 50 characters']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  color: {
    type: String,
    required: true,
    match: [/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color']
  }
}, { _id: false });

const personalTimetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  schedule: {
    Monday: [classSchema],
    Tuesday: [classSchema],
    Wednesday: [classSchema],
    Thursday: [classSchema],
    Friday: [classSchema],
    Saturday: [classSchema]
  }
}, {
  timestamps: true
});

// Index for better performance
personalTimetableSchema.index({ userId: 1 });

module.exports = mongoose.model('PersonalTimetable', personalTimetableSchema);