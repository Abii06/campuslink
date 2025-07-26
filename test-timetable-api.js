// Test personal timetable API

const API_BASE_URL = 'http://localhost:5000/api';

async function testTimetableAPI() {
  try {
    console.log('🧪 Testing Personal Timetable API...');
    
    // First, let's try to register a test user
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        role: "student",
        studentId: "TEST123",
        department: "Computer Science",
        year: 1
      })
    });

    const registerResult = await registerResponse.json();
    console.log('👤 Register response:', registerResult);

    let token;
    if (registerResult.success) {
      token = registerResult.token;
    } else {
      // Try to login instead
      console.log('👤 Registration failed, trying login...');
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "testuser@example.com",
          password: "password123"
        })
      });

      const loginResult = await loginResponse.json();
      console.log('👤 Login response:', loginResult);
      
      if (!loginResult.success) {
        console.error('❌ Failed to authenticate');
        return;
      }
      
      token = loginResult.token;
    }


    console.log('🔑 Got token:', token ? 'Yes' : 'No');

    // Test GET personal timetable
    console.log('📤 Getting personal timetable...');
    const getResponse = await fetch(`${API_BASE_URL}/personal-timetable`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📡 GET Response status:', getResponse.status);
    const getResult = await getResponse.json();
    console.log('📡 GET Response data:', JSON.stringify(getResult, null, 2));

    // Test PUT personal timetable
    console.log('📤 Updating personal timetable...');
    const testSchedule = {
      Monday: [
        {
          id: "test1",
          subject: "Test Subject",
          instructor: "Test Instructor",
          room: "Test Room",
          startTime: "09:00",
          endTime: "10:00",
          color: "#8b5cf6"
        }
      ],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };

    const putResponse = await fetch(`${API_BASE_URL}/personal-timetable`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ schedule: testSchedule })
    });

    console.log('📡 PUT Response status:', putResponse.status);
    const putResult = await putResponse.json();
    console.log('📡 PUT Response data:', JSON.stringify(putResult, null, 2));

    if (putResult.success) {
      console.log('✅ Personal Timetable updated successfully!');
      
      // Test GET again to verify it was saved
      console.log('📤 Getting updated timetable...');
      const getResponse2 = await fetch(`${API_BASE_URL}/personal-timetable`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const getResult2 = await getResponse2.json();
      console.log('📡 Updated timetable:', JSON.stringify(getResult2, null, 2));
    } else {
      console.log('❌ Failed to update Personal Timetable');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testTimetableAPI();