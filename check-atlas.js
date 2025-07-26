const mongoose = require('mongoose');

async function testAtlasConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    
    // Get your public IP
    const https = require('https');
    const getIP = () => {
      return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org?format=json', (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              const ip = JSON.parse(data).ip;
              resolve(ip);
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });
    };
    
    const publicIP = await getIP();
    console.log(`🌐 Your public IP: ${publicIP}`);
    console.log('📝 Make sure this IP is whitelisted in MongoDB Atlas Network Access');
    
    // Test connection
    const uri = 'mongodb+srv://abiramit2023cse:campuslink@cluster0.uf7ybhm.mongodb.net/campuslink';
    console.log('🔄 Attempting connection...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Atlas connection successful!');
    console.log(`📊 Connected to: ${mongoose.connection.name}`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Atlas connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('IP address')) {
      console.log('\n🔧 SOLUTION: Add your IP to Atlas whitelist:');
      console.log('1. Go to MongoDB Atlas Dashboard');
      console.log('2. Navigate to Network Access');
      console.log('3. Click "Add IP Address"');
      console.log('4. Add your current IP or use 0.0.0.0/0 for all IPs (less secure)');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔧 SOLUTION: Check credentials:');
      console.log('1. Verify username: abiramit2023cse');
      console.log('2. Verify password: campuslink');
      console.log('3. Make sure user has read/write permissions');
    }
  }
}

testAtlasConnection();