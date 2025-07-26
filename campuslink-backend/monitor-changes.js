const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function monitorDatabaseChanges() {
  try {
    console.log('🔍 Starting Real-time Database Monitor...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for monitoring\n');
    
    // Get initial counts
    const User = require('./models/User');
    const Announcement = require('./models/Announcement');
    const Complaint = require('./models/Complaint');
    const LostFound = require('./models/LostFound');
    const Timetable = require('./models/Timetable');
    
    let previousCounts = {
      users: await User.countDocuments(),
      announcements: await Announcement.countDocuments(),
      complaints: await Complaint.countDocuments(),
      lostFound: await LostFound.countDocuments(),
      timetables: await Timetable.countDocuments()
    };
    
    console.log('📊 Initial Database State:');
    console.log(`👥 Users: ${previousCounts.users}`);
    console.log(`📢 Announcements: ${previousCounts.announcements}`);
    console.log(`📝 Complaints: ${previousCounts.complaints}`);
    console.log(`🔍 Lost & Found: ${previousCounts.lostFound}`);
    console.log(`📅 Timetables: ${previousCounts.timetables}`);
    console.log('\n🔄 Monitoring for changes... (Press Ctrl+C to stop)\n');
    
    // Monitor changes every 2 seconds
    setInterval(async () => {
      try {
        const currentCounts = {
          users: await User.countDocuments(),
          announcements: await Announcement.countDocuments(),
          complaints: await Complaint.countDocuments(),
          lostFound: await LostFound.countDocuments(),
          timetables: await Timetable.countDocuments()
        };
        
        // Check for changes
        let hasChanges = false;
        
        if (currentCounts.users !== previousCounts.users) {
          console.log(`🆕 Users changed: ${previousCounts.users} → ${currentCounts.users}`);
          hasChanges = true;
        }
        
        if (currentCounts.announcements !== previousCounts.announcements) {
          console.log(`🆕 Announcements changed: ${previousCounts.announcements} → ${currentCounts.announcements}`);
          hasChanges = true;
        }
        
        if (currentCounts.complaints !== previousCounts.complaints) {
          console.log(`🆕 Complaints changed: ${previousCounts.complaints} → ${currentCounts.complaints}`);
          hasChanges = true;
        }
        
        if (currentCounts.lostFound !== previousCounts.lostFound) {
          console.log(`🆕 Lost & Found changed: ${previousCounts.lostFound} → ${currentCounts.lostFound}`);
          hasChanges = true;
        }
        
        if (currentCounts.timetables !== previousCounts.timetables) {
          console.log(`🆕 Timetables changed: ${previousCounts.timetables} → ${currentCounts.timetables}`);
          hasChanges = true;
        }
        
        if (hasChanges) {
          console.log(`⏰ Change detected at: ${new Date().toLocaleTimeString()}\n`);
          previousCounts = currentCounts;
        }
        
      } catch (error) {
        console.error('❌ Monitoring error:', error.message);
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ Monitor setup failed:', error.message);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping database monitor...');
  mongoose.disconnect();
  process.exit(0);
});

monitorDatabaseChanges();