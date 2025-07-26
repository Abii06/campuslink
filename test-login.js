// Test login functionality

const API_BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
  try {
    console.log('🧪 Testing Login API...');
    
    // Test with existing user
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

    console.log('📡 Login Response status:', loginResponse.status);
    const loginResult = await loginResponse.json();
    console.log('📡 Login Response data:', JSON.stringify(loginResult, null, 2));
    
    if (loginResult.success) {
      console.log('✅ Login successful!');
      console.log('👤 User:', loginResult.user.name, '(' + loginResult.user.email + ')');
      console.log('🔑 Token received:', loginResult.token ? 'Yes' : 'No');
      
      // Test /auth/me endpoint
      console.log('\n📤 Testing /auth/me endpoint...');
      const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginResult.token}`
        }
      });
      
      console.log('📡 /auth/me Response status:', meResponse.status);
      const meResult = await meResponse.json();
      console.log('📡 /auth/me Response data:', JSON.stringify(meResult, null, 2));
      
    } else {
      console.log('❌ Login failed:', loginResult.message);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testLogin();