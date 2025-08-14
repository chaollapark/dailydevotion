import dotenv from 'dotenv';
import { sendNewsletterEmail } from './services/brevo';
import { fetchLatestJobs } from './models/job';
import { generateNewsletterHTML } from './templates/newsletter';

// Load environment variables
dotenv.config();

async function testNewsletterPreview() {
  console.log('🧪 Testing actual newsletter preview...');
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
    const jobs = await fetchLatestJobs(5); // Fetch 5 jobs for the newsletter
    
    if (jobs.length === 0) {
      console.log('⚠️ No jobs found in database');
      return;
    }

    console.log(`✅ Successfully fetched ${jobs.length} jobs`);

    // Generate the actual newsletter HTML
    console.log('\n📧 Generating newsletter HTML...');
    const htmlContent = generateNewsletterHTML(jobs);
    console.log(`✅ HTML generated (${htmlContent.length} characters)`);

    // Save HTML to file for inspection
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '../newsletter-preview.html');
    
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`💾 Newsletter HTML saved to: ${outputPath}`);

    // Prepare email data for the actual newsletter
    const emailData = {
      subject: `📧 EUJobs Daily: ${jobs.length} New Job Opportunities - ${new Date().toLocaleDateString()}`,
      htmlContent: htmlContent,
      senderName: 'EUJobs.co',
      senderEmail: process.env.EMAIL_FROM || 'noreply@eujobs.online'
    };

    console.log('\n📤 Sending actual newsletter via Brevo...');
    console.log(`Subject: ${emailData.subject}`);
    console.log(`From: ${emailData.senderName} <${emailData.senderEmail}>`);
    console.log(`To: Newsletter list ID ${process.env.BREVO_NEWSLETTER_LIST_ID}`);
    console.log(`Jobs included: ${jobs.length}`);

    // Display job preview
    console.log('\n📋 Jobs in this newsletter:');
    jobs.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.title} at ${job.companyName}`);
      console.log(`     Location: ${job.city || 'Remote'}, ${job.country || 'EU'}`);
      console.log(`     Seniority: ${job.seniority}`);
      console.log(`     Type: ${job.type || 'Full'}-time`);
      if (job.salary) {
        console.log(`     Salary: ${job.salary} EUR`);
      }
      console.log('');
    });

    // Send the newsletter
    const campaignId = await sendNewsletterEmail(emailData);
    
    console.log('\n🎉 Newsletter sent successfully!');
    console.log(`📊 Campaign ID: ${campaignId}`);
    console.log('\n📝 Next steps:');
    console.log('1. Check the newsletter-preview.html file to see the design');
    console.log('2. Go to your Brevo dashboard to send the campaign');
    console.log('3. The newsletter will be sent to your contact list');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

// Run test
testNewsletterPreview()
  .then(() => {
    console.log('\n✅ Newsletter preview test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Newsletter preview test failed:', error);
    process.exit(1);
  });
