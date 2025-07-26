const mongoose = require('mongoose');
require('dotenv').config();

async function verifyIntegration() {
  try {
    console.log('🔍 Verifying Frontend-Backend Integration...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Import models
    const User = require('./models/User');
    const Announcement = require('./models/Announcement');
    const Complaint = require('./models/Complaint');
    const LostFound = require('./models/LostFound');
    const Timetable = require('./models/Timetable');
    
    // Get counts
    const userCount = await User.countDocuments();
    const announcementCount = await Announcement.countDocuments();
    const complaintCount = await Complaint.countDocuments();
    const lostFoundCount = await LostFound.countDocuments();
    const timetableCount = await Timetable.countDocuments();
    
    console.log('📊 Current Database State:');
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`📢 Total Announcements: ${announcementCount}`);
    console.log(`📝 Total Complaints: ${complaintCount}`);
    console.log(`🔍 Total Lost & Found Items: ${lostFoundCount}`);
    console.log(`📅 Total Timetables: ${timetableCount}\n`);
    
    // Show recent data
    console.log('📋 Recent Activity:');
    
    // Recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
    console.log('\n👥 Recent Users:');
    recentUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    // Recent announcements
    const recentAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(3);
    console.log('\n📢 Recent Announcements:');
    recentAnnouncements.forEach(announcement => {
      console.log(`- ${announcement.title} (${announcement.category})`);
    });
    
    // Recent complaints
    const recentComplaints = await Complaint.find().sort({ createdAt: -1 }).limit(3);
    console.log('\n📝 Recent Complaints:');
    if (recentComplaints.length === 0) {
      console.log('- No complaints yet');
    } else {
      recentComplaints.forEach(complaint => {
        console.log(`- ${complaint.title} (${complaint.status})`);
      });
    }
    
    // Recent lost & found
    const recentLostFound = await LostFound.find().sort({ createdAt: -1 }).limit(3);
    console.log('\n🔍 Recent Lost & Found:');
    if (recentLostFound.length === 0) {
      console.log('- No lost & found items yet');
    } else {
      recentLostFound.forEach(item => {
        console.log(`- ${item.title} (${item.type} - ${item.status})`);
      });
    }
    
    console.log('\n✅ Integration verification complete!');
    console.log('🔄 Run this script again after making changes in frontend to see updates');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyIntegration();