const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testRegistrationBlocking() {
  console.log('🧪 Testing Registration Blocking for Student and Admin Roles...\n');

  // Test 1: Try to register as student (should be blocked)
  console.log('1️⃣ Testing Student Registration (should be blocked)...');
  try {
    const studentData = {
      name: 'Test Student',
      email: 'teststudent@campuslink.com',
      password: 'test123',
      role: 'student',
      studentId: 'CS2024999',
      department: 'Computer Science',
      year: 2,
      phone: '9876543218'
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });

    const result = await response.json();
    
    if (response.status === 403) {
      console.log('✅ Student registration correctly blocked');
      console.log('📝 Message:', result.message);
    } else {
      console.log('❌ Student registration was NOT blocked');
      console.log('📝 Response:', result);
    }
  } catch (error) {
    console.log('❌ Error testing student registration:', error.message);
  }

  console.log('');

  // Test 2: Try to register as admin (should be blocked)
  console.log('2️⃣ Testing Admin Registration (should be blocked)...');
  try {
    const adminData = {
      name: 'Test Admin',
      email: 'testadmin@campuslink.com',
      password: 'test123',
      role: 'admin',
      phone: '9876543219'
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    });

    const result = await response.json();
    
    if (response.status === 403) {
      console.log('✅ Admin registration correctly blocked');
      console.log('📝 Message:', result.message);
    } else {
      console.log('❌ Admin registration was NOT blocked');
      console.log('📝 Response:', result);
    }
  } catch (error) {
    console.log('❌ Error testing admin registration:', error.message);
  }

  console.log('');

  // Test 3: Try to register as guest (should work)
  console.log('3️⃣ Testing Guest Registration (should work)...');
  try {
    const guestData = {
      name: 'Test Guest',
      email: 'testguest@campuslink.com',
      password: 'test123',
      role: 'guest',
      phone: '9876543220'
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(guestData)
    });

    const result = await response.json();
    
    if (response.status === 201 && result.success) {
      console.log('✅ Guest registration successful');
      console.log('👤 User ID:', result.user.id);
      console.log('🔑 Token received:', !!result.token);
    } else {
      console.log('❌ Guest registration failed');
      console.log('📝 Response:', result);
    }
  } catch (error) {
    console.log('❌ Error testing guest registration:', error.message);
  }

  console.log('');

  // Test 4: Try to register as visitor (should work)
  console.log('4️⃣ Testing Visitor Registration (should work)...');
  try {
    const visitorData = {
      name: 'Test Visitor',
      email: 'testvisitor@campuslink.com',
      password: 'test123',
      role: 'visitor',
      phone: '9876543221'
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visitorData)
    });

    const result = await response.json();
    
    if (response.status === 201 && result.success) {
      console.log('✅ Visitor registration successful');
      console.log('👤 User ID:', result.user.id);
      console.log('🔑 Token received:', !!result.token);
    } else {
      console.log('❌ Visitor registration failed');
      console.log('📝 Response:', result);
    }
  } catch (error) {
    console.log('❌ Error testing visitor registration:', error.message);
  }

  console.log('\n🎉 Registration blocking test completed!');
}

// Run the test
testRegistrationBlocking();