const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['lost', 'found']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'books', 'clothing', 'accessories', 'documents', 'keys', 'bags', 'other']
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [50, 'Item name cannot exceed 50 characters']
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [30, 'Brand cannot exceed 30 characters']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [20, 'Color cannot exceed 20 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time is required']
  },
  contactInfo: {
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: String,
    filename: String
  }],
  status: {
    type: String,
    enum: ['active', 'claimed', 'returned', 'expired'],
    default: 'active'
  },
  claimedBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    claimedAt: Date,
    verificationCode: String
  },
  isReward: {
    type: Boolean,
    default: false
  },
  rewardAmount: {
    type: Number,
    min: 0
  },
  expiryDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search and filtering
lostFoundSchema.index({ type: 1, category: 1, status: 1 });
lostFoundSchema.index({ location: 1 });
lostFoundSchema.index({ dateTime: -1 });
lostFoundSchema.index({ title: 'text', description: 'text', itemName: 'text' });

module.exports = mongoose.model('LostFound', lostFoundSchema);