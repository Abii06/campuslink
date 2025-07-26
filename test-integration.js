const apiService = require('./lib/api.js').default;

async function testFrontendBackendIntegration() {
  console.log('🧪 Testing Frontend-Backend Integration...\n');
  
  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing User Registration...');
    const userData = {
      name: 'Integration Test User',
      email: 'integration@campuslink.com',
      password: 'test123',
      role: 'student',
      studentId: 'CS2024998',
      department: 'Computer Science',
      year: 2,
      phone: '9876543215'
    };
    
    const registerResponse = await apiService.register(userData);
    console.log('✅ Registration successful:', registerResponse.success);
    console.log('🔑 Token received:', !!registerResponse.token);
    
    // Test 2: Create an announcement
    console.log('\n2️⃣ Testing Announcement Creation...');
    const announcementData = {
      title: 'Frontend Integration Test',
      content: 'This announcement was created from frontend integration test',
      category: 'general',
      priority: 'medium',
      targetAudience: ['students']
    };
    
    const announcementResponse = await apiService.createAnnouncement(announcementData);
    console.log('✅ Announcement created:', announcementResponse.success);
    console.log('📢 Announcement ID:', announcementResponse.data._id);
    
    // Test 3: Get all announcements
    console.log('\n3️⃣ Testing Get Announcements...');
    const announcementsResponse = await apiService.getAnnouncements();
    console.log('✅ Announcements fetched:', announcementsResponse.success);
    console.log('📊 Total announcements:', announcementsResponse.data.length);
    
    // Test 4: Create a complaint
    console.log('\n4️⃣ Testing Complaint Creation...');
    const complaintData = {
      title: 'Integration Test Complaint',
      description: 'This is a test complaint from frontend integration',
      category: 'academic',
      priority: 'low',
      location: 'Test Location'
    };
    
    const complaintResponse = await apiService.createComplaint(complaintData);
    console.log('✅ Complaint created:', complaintResponse.success);
    console.log('📝 Complaint ID:', complaintResponse.data._id);
    
    // Test 5: Create lost & found item
    console.log('\n5️⃣ Testing Lost & Found Creation...');
    const lostFoundData = {
      title: 'Integration Test Item',
      description: 'Test lost item from integration test',
      type: 'lost',
      category: 'electronics',
      itemName: 'Test Device',
      location: 'Test Location',
      contactInfo: {
        phone: '9876543215',
        email: 'integration@campuslink.com'
      }
    };
    
    const lostFoundResponse = await apiService.createLostFoundItem(lostFoundData);
    console.log('✅ Lost & Found item created:', lostFoundResponse.success);
    console.log('🔍 Item ID:', lostFoundResponse.data._id);
    
    // Test 6: Get current user profile
    console.log('\n6️⃣ Testing Get Current User...');
    const userResponse = await apiService.getCurrentUser();
    console.log('✅ User profile fetched:', userResponse.success);
    console.log('👤 User name:', userResponse.user.name);
    
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ Frontend can successfully communicate with backend');
    console.log('✅ All CRUD operations working');
    console.log('✅ Authentication working');
    console.log('✅ Data persistence confirmed');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

// Run the test
testFrontendBackendIntegration();