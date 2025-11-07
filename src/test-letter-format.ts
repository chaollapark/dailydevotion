import { generateLetterHTML, generateLetterText } from './templates/letter';
import { Letter } from './types/letter';
import * as fs from 'fs';

// Test letter data
const testLetter: Letter = {
  id: 1,
  filename: 'test-letter.txt',
  recipient: 'Bhagavan dasa',
  letter_date: '1976-11-07',
  month_day: '11-07',
  year_short: '76',
  title: 'Test Letter',
  location: 'Paris',
  body: `My dear Bhagavan dasa,

Please accept my blessings. I am in due receipt of your letter dated October 20, 1976, and I have noted the contents.

Regarding your questions about the preaching work in Europe, I am very pleased to hear of the progress you are making. The people of the western countries are taking to Krishna consciousness very seriously, and this is all due to your sincere efforts.

Continue to distribute our books and hold sankirtana programs. This is the most important work. When people read Srila Prabhupada's books, they will naturally become attracted to Krishna consciousness.

I hope this meets you in good health.

Your ever well-wisher,
A.C. Bhaktivedanta Swami Prabhupada`,
  word_count: 427,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

function testLetterFormat() {
  console.log('🧪 Testing letter format generation...');
  console.log('=====================================\n');

  try {
    // Test HTML generation
    console.log('1️⃣ Testing HTML generation...');
    const htmlContent = generateLetterHTML(testLetter);
    
    // Verify HTML structure
    const htmlChecks = [
      { name: 'DOCTYPE declaration', check: htmlContent.includes('<!DOCTYPE html>') },
      { name: 'HTML tag', check: htmlContent.includes('<html>') },
      { name: 'Head section', check: htmlContent.includes('<head>') },
      { name: 'Body section', check: htmlContent.includes('<body style=') },
      { name: 'Letter title', check: htmlContent.includes("Srila Prabhupada's Letters") },
      { name: 'Recipient name', check: htmlContent.includes('Bhagavan dasa') },
      { name: 'Location', check: htmlContent.includes('Paris') },
      { name: 'Formatted date', check: htmlContent.includes('November 7, 1976') },
      { name: 'Letter body', check: htmlContent.includes('Please accept my blessings') },
      { name: 'Signature', check: htmlContent.includes('Hare Krishna') },
      { name: 'Vanipedia link', check: htmlContent.includes('vanipedia.com') },
      { name: 'Radhadesh link', check: htmlContent.includes('radhadesh.com') },
      { name: 'Subscribe button', check: htmlContent.includes('Subscribe to Daily Letters') },
      { name: 'Unsubscribe link', check: htmlContent.includes('{{unsubscribe}}') }
    ];

    let htmlPassed = 0;
    htmlChecks.forEach(({ name, check }) => {
      if (check) {
        console.log(`   ✅ ${name}`);
        htmlPassed++;
      } else {
        console.log(`   ❌ ${name}`);
      }
    });
    
    console.log(`   HTML: ${htmlPassed}/${htmlChecks.length} checks passed\n`);

    // Test text generation
    console.log('2️⃣ Testing text generation...');
    const textContent = generateLetterText(testLetter);
    
    const textChecks = [
      { name: 'Letter title', check: textContent.includes('SRILA PRABHUPADA\'S LETTERS') },
      { name: 'Recipient name', check: textContent.includes('Bhagavan dasa') },
      { name: 'Location', check: textContent.includes('Paris') },
      { name: 'Formatted date', check: textContent.includes('November 7, 1976') },
      { name: 'Letter body', check: textContent.includes('Please accept my blessings') },
      { name: 'Signature', check: textContent.includes('Hare Krishna 🙏') },
      { name: 'Unsubscribe placeholder', check: textContent.includes('{{unsubscribe}}') }
    ];

    let textPassed = 0;
    textChecks.forEach(({ name, check }) => {
      if (check) {
        console.log(`   ✅ ${name}`);
        textPassed++;
      } else {
        console.log(`   ❌ ${name}`);
      }
    });
    
    console.log(`   Text: ${textPassed}/${textChecks.length} checks passed\n`);

    // Save test outputs
    console.log('3️⃣ Saving test outputs...');
    fs.writeFileSync('test-letter-format-html.html', htmlContent);
    fs.writeFileSync('test-letter-format-text.txt', textContent);
    console.log('   ✅ HTML saved to test-letter-format-html.html');
    console.log('   ✅ Text saved to test-letter-format-text.txt\n');

    // Summary
    const totalChecks = htmlChecks.length + textChecks.length;
    const totalPassed = htmlPassed + textPassed;
    
    console.log('📊 Test Summary:');
    console.log('==================');
    console.log(`Total checks: ${totalPassed}/${totalChecks} passed`);
    console.log(`HTML format: ${htmlPassed}/${htmlChecks.length} passed`);
    console.log(`Text format: ${textPassed}/${textChecks.length} passed`);
    
    if (totalPassed === totalChecks) {
      console.log('\n🎉 All tests passed! Letter format is working correctly.');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some tests failed. Please check the output above.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

testLetterFormat();
