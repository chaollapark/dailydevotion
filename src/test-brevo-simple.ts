import dotenv from 'dotenv';
import { sendNewsletterEmail } from './services/brevo';

// Load environment variables
dotenv.config();

async function testBrevoSimple() {
  console.log('🧪 Testing Brevo email sending (simple test)...');
  console.log('==============================================');

  try {
    // Check only Brevo-related environment variables
    console.log('\n🔧 Checking Brevo environment variables...');
    const requiredEnvVars = [
      'BREVO_API_KEY',
      'BREVO_NEWSLETTER_LIST_ID',
      'EMAIL_FROM'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:');
      missingVars.forEach(varName => console.log(`  - ${varName}`));
      console.log('\n📝 To run this test, you need to:');
      console.log('1. Create a .env file based on env.example');
      console.log('2. Add your Brevo API key');
      console.log('3. Add your Brevo newsletter list ID');
      console.log('4. Set the sender email address');
      throw new Error('Missing required environment variables');
    } else {
      console.log('✅ All required environment variables are set');
    }

    // Create a simple test email
    const testHtmlContent = `
      <html>
        <body>
          <h1>🧪 Test Newsletter</h1>
          <p>This is a test email sent from the EUJobs newsletter system.</p>
          <p>If you receive this, the Brevo integration is working correctly!</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </body>
      </html>
    `;

    const emailData = {
      subject: `🧪 TEST: EUJobs Newsletter Test - ${new Date().toLocaleDateString()}`,
      htmlContent: testHtmlContent,
      senderName: 'EUJobs.co (Test)',
      senderEmail: process.env.EMAIL_FROM || 'noreply@eujobs.online'
    };

    console.log('\n📤 Sending test newsletter via Brevo...');
    console.log(`Subject: ${emailData.subject}`);
    console.log(`From: ${emailData.senderName} <${emailData.senderEmail}>`);
    console.log(`To: Newsletter list ID ${process.env.BREVO_NEWSLETTER_LIST_ID}`);

    // Send the newsletter
    const campaignId = await sendNewsletterEmail(emailData);
    
    console.log('\n🎉 Test newsletter sent successfully!');
    console.log(`📊 Campaign ID: ${campaignId}`);
    console.log('\n📝 Check your email inbox for the test newsletter!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

// Run test
testBrevoSimple()
  .then(() => {
    console.log('\n✅ Simple Brevo test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Simple Brevo test failed:', error);
    process.exit(1);
  });
