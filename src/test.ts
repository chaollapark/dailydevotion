import dotenv from 'dotenv';
import { getTodaysLetter, getLetterByMonthDay } from './services/supabase';
import { generateLetterHTML } from './templates/letter';
import * as fs from 'fs';

dotenv.config();

async function testLetter() {
  console.log('🧪 Testing letter generation...');
  console.log('=====================================\n');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Checking environment variables...');
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'BREVO_API_KEY',
      'BREVO_NEWSLETTER_LIST_ID',
      'EMAIL_FROM'
    ];

    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
      process.exit(1);
    }
    console.log('✅ All environment variables set\n');

    // Test 2: Fetch today's letter
    console.log('2️⃣ Fetching today\'s letter...');
    const letter = await getTodaysLetter();
    
    if (!letter) {
      console.log('⚠️ No letter found for today');
      console.log('   Trying a known date (07-14) for testing...\n');
      
      const testLetter = await getLetterByMonthDay('07-14');
      if (!testLetter) {
        console.error('❌ Could not fetch test letter either');
        process.exit(1);
      }
      
      console.log('✅ Using test letter for preview\n');
      generatePreview(testLetter);
    } else {
      console.log('✅ Found today\'s letter\n');
      generatePreview(letter);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

function generatePreview(letter: any) {
  console.log('3️⃣ Generating HTML preview...');
  console.log(`   Recipient: ${letter.recipient}`);
  console.log(`   Date: ${letter.letter_date}`);
  console.log(`   Location: ${letter.location || 'Unknown'}`);
  console.log(`   Word Count: ${letter.word_count}`);

  const html = generateLetterHTML(letter);
  const filename = 'test-letter-preview.html';
  
  fs.writeFileSync(filename, html);
  console.log(`✅ Preview saved to ${filename}`);
  console.log(`   Open this file in your browser to see the email\n`);

  console.log('🎉 Test completed successfully!');
  console.log('   To send the actual email, run: npm run dev');
}

testLetter();
