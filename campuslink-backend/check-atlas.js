const mongoose = require('mongoose');

async function testAtlasConnection() {
  try {
    console.log('🔍 Comprehensive MongoDB Atlas Diagnostics...\n');
    
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
    console.log('📝 Verify this IP is whitelisted in Atlas Network Access\n');
    
    // Test different connection scenarios
    const baseUri = 'mongodb+srv://abiramit2023cse:campuslink@cluster0.uf7ybhm.mongodb.net';
    
    console.log('🔧 Testing different connection scenarios...\n');
    
    // Test 1: Connection without database name
    console.log('Test 1: Connecting without database name...');
    try {
      await mongoose.connect(baseUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log('✅ Base connection successful!');
      console.log(`📊 Default database: ${mongoose.connection.name || 'test'}`);
      await mongoose.disconnect();
    } catch (error) {
      console.log('❌ Base connection failed:', error.message);
    }
    
    // Test 2: Connection with database name
    console.log('\nTest 2: Connecting with database name...');
    try {
      await mongoose.connect(`${baseUri}/campuslink`, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log('✅ Database connection successful!');
      console.log(`📊 Connected to database: ${mongoose.connection.name}`);
      await mongoose.disconnect();
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
    }
    
    // Test 3: Test with different options
    console.log('\nTest 3: Testing with retry options...');
    try {
      await mongoose.connect(`${baseUri}/campuslink`, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority'
      });
      console.log('✅ Advanced connection successful!');
      console.log(`📊 Connected to: ${mongoose.connection.name}`);
      await mongoose.disconnect();
    } catch (error) {
      console.log('❌ Advanced connection failed:', error.message);
    }
    
  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
  }
  
  console.log('\n📋 TROUBLESHOOTING CHECKLIST:');
  console.log('□ IP Address whitelisted in Atlas Network Access');
  console.log('□ Database user exists with correct permissions');
  console.log('□ Cluster is running (not paused)');
  console.log('□ Connection string is correct');
  console.log('□ No firewall blocking outbound connections');
  console.log('\n🔗 Atlas Dashboard: https://cloud.mongodb.com/');
}

testAtlasConnection();