import dotenv from 'dotenv';
import * as Brevo from '@getbrevo/brevo';
import { getTodaysLetter } from './services/supabase';
import { generateLetterHTML } from './templates/letter';

dotenv.config();

async function testSendToEmail(testEmail: string) {
  console.log(`🧪 Testing email send to: ${testEmail}`);
  console.log('=====================================\n');
  
  try {
    // Step 1: Get today's letter
    console.log('📋 Fetching today\'s letter...');
    const letter = await getTodaysLetter();
    
    if (!letter) {
      console.error('❌ No letter found for today');
      console.log('💡 Tip: Make sure your database has a letter for today\'s date');
      return;
    }

    console.log(`✅ Found letter to ${letter.recipient}`);

    // Step 2: Generate HTML
    console.log('📧 Generating email HTML...');
    const htmlContent = generateLetterHTML(letter);
    
    const letterDate = new Date(letter.letter_date);
    const formattedDate = letterDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Step 3: Initialize Brevo Transactional Email API
    console.log('🔌 Connecting to Brevo...');
    const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
    const transactionalEmailsApi = new Brevo.TransactionalEmailsApi();
    transactionalEmailsApi.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey
    );

    // Step 4: Send test email
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `[TEST] Letter to ${letter.recipient} - ${formattedDate}`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { 
      name: "Prabhupada's Letters", 
      email: process.env.EMAIL_FROM || 'letters@asdfasdf.com'
    };
    sendSmtpEmail.to = [{ email: testEmail }];

    console.log('📨 Sending test email...');
    const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    
    console.log('\n✅ Test email sent successfully!');
    console.log('📊 Message ID:', response.body.messageId);
    console.log(`📬 Sent to: ${testEmail}`);
    console.log('\n💡 Check your inbox (and spam folder) in a few moments!');
    
  } catch (error) {
    console.error('\n❌ Error sending test email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Error details:', (error as any).response?.body);
    }
    throw error;
  }
}

// Run with email from command line or default
const testEmail = process.argv[2] || 'chaollapark@gmail.com';
testSendToEmail(testEmail)
  .then(() => {
    console.log('\n🎉 Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });