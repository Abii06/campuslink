const mongoose = require('mongoose');
require('dotenv').config();

async function testLocalDatabase() {
  try {
    console.log('🧪 Testing Local MongoDB Database...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to local MongoDB');
    
    // Get database info
    const db = mongoose.connection.db;
    const admin = db.admin();
    const dbStats = await db.stats();
    
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📁 Collections: ${dbStats.collections}`);
    console.log(`📄 Documents: ${dbStats.objects}`);
    console.log(`💾 Data Size: ${(dbStats.dataSize / 1024).toFixed(2)} KB`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Available Collections:');
    if (collections.length === 0) {
      console.log('   No collections yet (will be created when data is added)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    // Test basic operations
    console.log('\n🔧 Testing Basic Operations:');
    
    // Test User model
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Test other models
    const Announcement = require('./models/Announcement');
    const announcementCount = await Announcement.countDocuments();
    console.log(`📢 Announcements: ${announcementCount}`);
    
    const Complaint = require('./models/Complaint');
    const complaintCount = await Complaint.countDocuments();
    console.log(`📝 Complaints: ${complaintCount}`);
    
    const LostFound = require('./models/LostFound');
    const lostFoundCount = await LostFound.countDocuments();
    console.log(`🔍 Lost & Found items: ${lostFoundCount}`);
    
    const Timetable = require('./models/Timetable');
    const timetableCount = await Timetable.countDocuments();
    console.log(`📅 Timetables: ${timetableCount}`);
    
    console.log('\n✅ Local MongoDB is working perfectly!');
    console.log('🚀 Ready for API testing with Postman');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testLocalDatabase();