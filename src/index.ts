import dotenv from 'dotenv';
import { fetchLatestJobs } from './models/job';
import { sendNewsletterEmail } from './services/brevo';
import { generateNewsletterHTML } from './templates/newsletter';

// Load environment variables
dotenv.config();

async function sendDailyNewsletter() {
  console.log('🚀 Starting daily newsletter process...');
  console.log('=====================================');

  try {
    // Step 1: Fetch the latest 10 jobs
    console.log('📋 Fetching latest jobs from database...');
    const jobs = await fetchLatestJobs(10);
    
    if (jobs.length === 0) {
      console.log('⚠️ No jobs found. Skipping newsletter.');
      return;
    }

    console.log(`✅ Found ${jobs.length} jobs to include in newsletter`);

    // Step 2: Generate newsletter HTML
    console.log('📧 Generating newsletter HTML...');
    const htmlContent = generateNewsletterHTML(jobs);
    
    // Step 3: Send newsletter email
    console.log('📨 Sending newsletter to subscribers...');
    const emailData = {
      subject: `EUJobs Daily: ${jobs.length} New Job Opportunities - ${new Date().toLocaleDateString()}`,
      htmlContent,
      senderName: 'EUJobs.co',
      senderEmail: process.env.EMAIL_FROM || 'noreply@eujobs.online'
    };

    const response = await sendNewsletterEmail(emailData);
    
    console.log('✅ Newsletter sent successfully!');
    console.log('📊 Response:', response);
    
    // Log summary
    console.log('\n📝 Newsletter Summary:');
    console.log('======================');
    console.log(`📧 Jobs included: ${jobs.length}`);
    console.log(`📅 Date: ${new Date().toLocaleDateString()}`);
    console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    
    // Log job titles for reference
    console.log('\n📋 Jobs included:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.companyName} (${job.seniority})`);
    });

  } catch (error) {
    console.error('❌ Error sending daily newsletter:', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  sendDailyNewsletter()
    .then(() => {
      console.log('\n🎉 Daily newsletter process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Daily newsletter process failed:', error);
      process.exit(1);
    });
}

export { sendDailyNewsletter };
