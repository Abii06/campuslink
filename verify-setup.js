// Quick verification script to check if all components are properly set up
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying CampusLink Setup...\n');

// Check if all required files exist
const requiredFiles = [
  'app/layout.jsx',
  'app/page.jsx',
  'app/globals.css',
  'app/components/ClientLayout.jsx',
  'app/components/Navbar.jsx',
  'app/contexts/AuthContext.jsx',
  'app/contexts/DataContext.jsx',
  'app/contexts/ThemeContext.jsx',
  'app/pages/Landing.jsx',
  'app/pages/Dashboard.jsx',
  'app/pages/Login.jsx',
  'app/pages/Announcements.jsx',
  'app/pages/LostFound.jsx',
  'app/pages/Timetable.jsx',
  'app/pages/Complaints.jsx',
  'app/pages/Admin.jsx',
  'app/dashboard/page.jsx',
  'app/login/page.jsx',
  'app/announcements/page.jsx',
  'app/lost-found/page.jsx',
  'app/timetable/page.jsx',
  'app/complaints/page.jsx',
  'app/admin/page.jsx',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log('✅', file);
  } else {
    console.log('❌', file, '- MISSING');
    allFilesExist = false;
  }
});

console.log('\n📊 Summary:');
if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('🚀 Your CampusLink application should be fully functional.');
  console.log('\n📋 Next Steps:');
  console.log('1. Make sure the dev server is running: npm run dev');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('3. Use the testing guide (TESTING_GUIDE.md) to verify all features');
  console.log('\n🔑 Demo Credentials:');
  console.log('   Admin: admin@college.edu / admin123');
  console.log('   Student: student@college.edu / student123');
} else {
  console.log('⚠️  Some files are missing. Please check the setup.');
}

console.log('\n🎯 Features Available:');
console.log('   📢 Campus Announcements (with admin controls)');
console.log('   🔍 Lost & Found System');
console.log('   📅 Personal Timetable Scheduler');
console.log('   🏠 Hostel Complaint System');
console.log('   🔐 Role-based Authentication');
console.log('   👨‍💼 Admin Dashboard');
console.log('   🎨 Modern Responsive UI');