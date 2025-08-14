import * as Brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Brevo client
const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
const campaigns = new Brevo.EmailCampaignsApi();
campaigns.setApiKey(Brevo.EmailCampaignsApiApiKeys.apiKey, apiKey);

// Newsletter list ID from environment
const NEWSLETTER_LIST_ID = Number(process.env.BREVO_NEWSLETTER_LIST_ID || 0);

console.log('🔍 Debug - Environment variables:');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Set' : 'Not set');
console.log('BREVO_NEWSLETTER_LIST_ID:', process.env.BREVO_NEWSLETTER_LIST_ID);
console.log('NEWSLETTER_LIST_ID (parsed):', NEWSLETTER_LIST_ID);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

export interface NewsletterEmailData {
  subject: string;
  htmlContent: string;
  senderName?: string;
  senderEmail?: string;
}

export async function sendNewsletterEmail(data: NewsletterEmailData) {
  try {
    if (!NEWSLETTER_LIST_ID) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID environment variable is required');
    }

    const fromEmail = process.env.EMAIL_FROM || 'noreply@eujobs.online';
    const cleanEmail = fromEmail.includes('<') ? fromEmail.match(/<(.+?)>/)?.[1] || fromEmail : fromEmail;

    // 1) Create the campaign
    const campaign = new Brevo.CreateEmailCampaign();
    campaign.name = `Newsletter: ${data.subject}`;
    campaign.subject = data.subject;
    campaign.sender = { 
      name: data.senderName || 'EUJobs.co', 
      email: cleanEmail 
    };
    campaign.htmlContent = data.htmlContent;
    campaign.recipients = { listIds: [NEWSLETTER_LIST_ID] };

    console.log(`📨 Creating newsletter campaign for list ID: ${NEWSLETTER_LIST_ID}`);
    
    const { body } = await campaigns.createEmailCampaign(campaign);

    // 2) Send it now
    console.log(`📤 Campaign created with ID: ${body.id}`);
    
    // For now, just return the campaign ID
    // The campaign can be sent manually from the Brevo dashboard
    console.log("✅ Newsletter campaign created successfully with Brevo");
    console.log("📝 Note: Campaign needs to be sent manually from Brevo dashboard");
    return body.id;
  } catch (error) {
    console.error("❌ Error sending newsletter with Brevo:", error);
    if (error && typeof error === 'object') {
      console.error('Error details:', error);
    }
    throw new Error("Failed to send newsletter email.");
  }
}

export async function getNewsletterSubscribers() {
  try {
    if (!NEWSLETTER_LIST_ID) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID environment variable is required');
    }

    // Initialize Contacts API
    const contactsApi = new Brevo.ContactsApi();
    contactsApi.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);

    // Get contacts from the newsletter list
    const response = await contactsApi.getContactsFromList(NEWSLETTER_LIST_ID);

    console.log(`✅ Retrieved ${response.body?.contacts?.length || 0} newsletter subscribers`);
    return response.body?.contacts || [];
  } catch (error) {
    console.error("❌ Error getting newsletter subscribers:", error);
    throw error;
  }
}