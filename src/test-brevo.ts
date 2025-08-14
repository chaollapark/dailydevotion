import dotenv from 'dotenv';
import { sendNewsletterEmail } from './services/brevo';
import { fetchLatestJobs } from './models/job';
import { generateNewsletterHTML } from './templates/newsletter';

// Load environment variables
dotenv.config();

async function testBrevoNewsletter() {
  console.log('🧪 Testing Brevo newsletter sending...');
  console.log('=====================================');

  try {
    // Check environment variables
    console.log('\n🔧 Checking environment variables...');
    const requiredEnvVars = [
      'MONGODB_URI',
      'BREVO_API_KEY',
      'BREVO_NEWSLETTER_LIST_ID',
      'EMAIL_FROM'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:');
      missingVars.forEach(varName => console.log(`  - ${varName}`));
      throw new Error('Missing required environment variables');
    } else {
      console.log('✅ All required environment variables are set');
    }

    // Fetch jobs
    console.log('\n📋 Fetching latest jobs...');
    const jobs = await fetchLatestJobs(5); // Fetch only 5 for testing
    
    if (jobs.length === 0) {
      console.log('⚠️ No jobs found in database');
      return;
    }

    console.log(`✅ Successfully fetched ${jobs.length} jobs`);

    // Generate newsletter HTML
    console.log('\n📧 Generating newsletter HTML...');
    const htmlContent = generateNewsletterHTML(jobs);
    console.log(`✅ HTML generated (${htmlContent.length} characters)`);

    // Prepare email data
    const emailData = {
      subject: `🧪 TEST: EUJobs Daily - ${jobs.length} New Job Opportunities`,
      htmlContent: htmlContent,
      senderName: 'EUJobs.co (Test)',
      senderEmail: process.env.EMAIL_FROM || 'noreply@eujobs.online'
    };

    console.log('\n📤 Sending newsletter via Brevo...');
    console.log(`Subject: ${emailData.subject}`);
    console.log(`From: ${emailData.senderName} <${emailData.senderEmail}>`);
    console.log(`To: Newsletter list ID ${process.env.BREVO_NEWSLETTER_LIST_ID}`);
    console.log(`Jobs included: ${jobs.length}`);

    // Send the newsletter
    const campaignId = await sendNewsletterEmail(emailData);
    
    console.log('\n🎉 Newsletter sent successfully!');
    console.log(`📊 Campaign ID: ${campaignId}`);
    console.log('\n📝 Test completed - check your email inbox!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

// Run test
testBrevoNewsletter()
  .then(() => {
    console.log('\n✅ Brevo test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Brevo test failed:', error);
    process.exit(1);
  });
