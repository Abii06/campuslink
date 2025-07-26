// Test authentication with the frontend token

const API_BASE_URL = 'http://localhost:5000/api';

async function testAuthWithFrontendToken() {
  try {
    console.log('🧪 Testing authentication with frontend token...');
    
    // You need to get this token from your browser's localStorage
    // Open browser console and run: localStorage.getItem('token')
    const token = 'YOUR_TOKEN_HERE'; // Replace with actual token from browser
    
    if (token === 'YOUR_TOKEN_HERE') {
      console.log('❌ Please replace YOUR_TOKEN_HERE with the actual token from your browser');
      console.log('💡 To get the token:');
      console.log('   1. Open your browser');
      console.log('   2. Go to the CampusLink app');
      console.log('   3. Open Developer Tools (F12)');
      console.log('   4. Go to Console tab');
      console.log('   5. Type: localStorage.getItem("token")');
      console.log('   6. Copy the token and replace YOUR_TOKEN_HERE in this script');
      return;
    }
    
    console.log('🔑 Testing with token:', token.substring(0, 20) + '...');
    
    // Test authentication
    console.log('👤 Testing /auth/me endpoint...');
    const authResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Auth response status:', authResponse.status);
    const authResult = await authResponse.json();
    console.log('📡 Auth response:', JSON.stringify(authResult, null, 2));
    
    if (!authResult.success) {
      console.log('❌ Authentication failed');
      return;
    }
    
    console.log('✅ Authentication successful');
    console.log('👤 User:', authResult.user.name, '(' + authResult.user.email + ')');
    
    // Test lost-found endpoint
    console.log('📤 Testing lost-found creation...');
    const testItem = {
      title: "Test Item from Script",
      description: "This is a test item created from the test script",
      type: "lost",
      category: "electronics",
      itemName: "Test Phone",
      location: "Library",
      dateTime: new Date().toISOString()
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/lost-found`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testItem)
    });
    
    console.log('📡 Create response status:', createResponse.status);
    const createResult = await createResponse.json();
    console.log('📡 Create response:', JSON.stringify(createResult, null, 2));
    
    if (createResult.success) {
      console.log('✅ Lost & Found item created successfully!');
    } else {
      console.log('❌ Failed to create Lost & Found item');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuthWithFrontendToken();