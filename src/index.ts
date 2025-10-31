import dotenv from 'dotenv';
import { getTodaysLetter } from './services/supabase';
import { sendNewsletterEmail } from './services/brevo';
import { generateLetterHTML, generateLetterText } from './templates/letter';

// Load environment variables
dotenv.config();

async function sendDailyLetter() {
  console.log('🚀 Starting daily letter process...');
  console.log('=====================================');

  try {
    // Step 1: Fetch today's letter from Supabase
    console.log('📋 Fetching today\'s letter from Supabase...');
    const letter = await getTodaysLetter();
    
    if (!letter) {
      console.log('⚠️ No letter found for today. Skipping email.');
      return;
    }

    console.log(`✅ Found letter to ${letter.recipient}`);

    // Step 2: Generate email HTML
    console.log('📧 Generating email HTML...');
    const htmlContent = generateLetterHTML(letter);
    const textContent = generateLetterText(letter);
    
    // Step 3: Send email via Brevo
    console.log('📨 Sending letter to subscribers...');
    
    const letterDate = new Date(letter.letter_date);
    const formattedDate = letterDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const emailData = {
      subject: `Letter to ${letter.recipient} - ${formattedDate}`,
      htmlContent,
      senderName: 'Prabhupada\'s Letters',
      senderEmail: process.env.EMAIL_FROM || 'letters@radhadesh.com'
    };

    const response = await sendNewsletterEmail(emailData);
    
    console.log('✅ Letter sent successfully!');
    console.log('📊 Campaign ID:', response);
    
    // Log summary
    console.log('\n📝 Letter Summary:');
    console.log('======================');
    console.log(`📧 Recipient: ${letter.recipient}`);
    console.log(`📅 Letter Date: ${formattedDate}`);
    console.log(`📍 Location: ${letter.location || 'Unknown'}`);
    console.log(`📊 Word Count: ${letter.word_count}`);
    console.log(`⏰ Sent At: ${new Date().toLocaleTimeString()}`);

  } catch (error) {
    console.error('❌ Error sending daily letter:', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  sendDailyLetter()
    .then(() => {
      console.log('\n🎉 Daily letter process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Daily letter process failed:', error);
      process.exit(1);
    });
}

export { sendDailyLetter };
