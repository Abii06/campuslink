// Test script to check API connectivity and authentication
const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('🔍 Testing API health...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Try to access protected route without token
    console.log('\n🔍 Testing protected route without token...');
    const noTokenResponse = await fetch(`${API_BASE_URL}/lost-found`);
    const noTokenData = await noTokenResponse.json();
    console.log('❌ No token response:', noTokenData);

    // Test 3: Try to login with test credentials
    console.log('\n🔍 Testing login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('🔐 Login response:', loginData);

    if (loginData.success && loginData.token) {
      // Test 4: Try to access protected route with token
      console.log('\n🔍 Testing protected route with token...');
      const tokenResponse = await fetch(`${API_BASE_URL}/lost-found`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      const tokenData = await tokenResponse.json();
      console.log('✅ With token response:', tokenData);

      // Test 5: Try to create a lost found item
      console.log('\n🔍 Testing lost found item creation...');
      const createResponse = await fetch(`${API_BASE_URL}/lost-found`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          title: 'Test Item',
          description: 'This is a test item',
          type: 'lost',
          category: 'electronics',
          itemName: 'Test Item',
          location: 'Test Location',
          dateTime: new Date().toISOString(),
          contactInfo: {
            email: 'test@example.com'
          }
        })
      });
      const createData = await createResponse.json();
      console.log('📝 Create item response:', createData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();