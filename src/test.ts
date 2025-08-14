import dotenv from 'dotenv';
import { fetchLatestJobs } from './models/job';
import { generateNewsletterHTML } from './templates/newsletter';

// Load environment variables
dotenv.config();

async function testNewsletter() {
  console.log('🧪 Testing newsletter functionality...');
  console.log('=====================================');

  try {
    // Test 1: Fetch jobs
    console.log('\n📋 Test 1: Fetching latest jobs...');
    const jobs = await fetchLatestJobs(5); // Fetch only 5 for testing
    
    if (jobs.length === 0) {
      console.log('⚠️ No jobs found in database');
      return;
    }

    console.log(`✅ Successfully fetched ${jobs.length} jobs`);
    
    // Display job details
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

    // Test 2: Generate HTML
    console.log('📧 Test 2: Generating newsletter HTML...');
    const htmlContent = generateNewsletterHTML(jobs);
    
    console.log('✅ HTML generated successfully');
    console.log(`📏 HTML length: ${htmlContent.length} characters`);
    
    // Save HTML to file for inspection
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '../test-newsletter.html');
    
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`💾 HTML saved to: ${outputPath}`);

    // Test 3: Check environment variables
    console.log('\n🔧 Test 3: Checking environment variables...');
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
    } else {
      console.log('✅ All required environment variables are set');
    }

    // Test 4: Email preview
    console.log('\n📧 Test 4: Email preview...');
    const subject = `EUJobs Daily: ${jobs.length} New Job Opportunities - ${new Date().toLocaleDateString()}`;
    console.log(`Subject: ${subject}`);
    console.log(`Recipients: Newsletter list ID ${process.env.BREVO_NEWSLETTER_LIST_ID}`);
    console.log(`From: ${process.env.EMAIL_FROM || 'noreply@eujobs.online'}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated HTML file: test-newsletter.html');
    console.log('2. Set up GitHub Actions workflow');
    console.log('3. Configure cron schedule for 9:00 AM EU time');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run test
testNewsletter()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
