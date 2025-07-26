const { body, validationResult } = require('express-validator');

// Test email validation
const testEmails = [
  'cfvgb@hbjn.bhjn',
  'test@example.com',
  'user@domain.co',
  'invalid-email',
  'test@test.test'
];

async function testEmailValidation() {
  console.log('🧪 Testing email validation...');
  
  for (const email of testEmails) {
    console.log(`\n📧 Testing email: "${email}"`);
    
    // Create a mock request object
    const req = {
      body: {
        contactInfo: {
          email: email
        }
      }
    };
    
    // Apply validation
    const validator = body('contactInfo.email').optional().isEmail().withMessage('Valid email required');
    await validator.run(req);
    
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      console.log('✅ Valid email');
    } else {
      console.log('❌ Invalid email:', errors.array()[0].msg);
    }
  }
}

testEmailValidation().catch(console.error);