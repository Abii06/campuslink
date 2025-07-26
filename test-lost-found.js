// Use built-in fetch (Node.js 18+)

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testItem = {
  title: "Test Lost Item",
  description: "This is a test lost item",
  type: "lost",
  category: "electronics",
  itemName: "Test Phone",
  location: "Library",
  dateTime: new Date().toISOString(),
  contactInfo: {
    email: "test@example.com"
  }
};

async function testLostFoundAPI() {
  try {
    console.log('🧪 Testing Lost & Found API...');
    console.log('📤 Sending data:', JSON.stringify(testItem, null, 2));
    
    // First, let's try to register a test user to get a token
    const registerData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "student",
      studentId: "TEST123",
      department: "Computer Science",
      year: 1
    };

    console.log('👤 Registering test user...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });

    const registerResult = await registerResponse.json();
    console.log('👤 Register response:', registerResult);

    if (!registerResult.success) {
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
      
      var token = loginResult.token;
    } else {
      var token = registerResult.token;
    }

    console.log('🔑 Got token:', token ? 'Yes' : 'No');

    // Now test the lost & found API
    console.log('📤 Creating lost & found item...');
    const response = await fetch(`${API_BASE_URL}/lost-found`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testItem)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Lost & Found item created successfully!');
    } else {
      console.log('❌ Failed to create Lost & Found item');
      if (result.errors) {
        console.log('❌ Validation errors:', result.errors);
      }
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testLostFoundAPI();