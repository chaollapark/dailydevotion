# Prabhupada's Letters - Daily Newsletter Cron Job

This is a standalone cron job that sends daily letters from Srila Prabhupada to Brevo subscribers. Each day, subscribers receive one letter corresponding to that day of the year (e.g., January 15th gets a letter written on January 15th).

## Features

- 🕘 Runs daily at 9:00 AM via GitHub Actions
- 📧 Sends beautiful HTML newsletters to Brevo subscribers
- 📅 Complete coverage - letters for all 366 days of the year
- 📱 Responsive email design that works on all devices
- 🔧 Easy to test and deploy
- 📊 Comprehensive logging and error handling

## Database

The letters are stored in Supabase with the following structure:
- **6,198 letters** from Srila Prabhupada
- **Complete daily coverage** (all 366 days including leap day)
- Indexed by `month_day` for fast daily queries

## Setup

### 1. Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `BREVO_API_KEY`: Your Brevo API key
- `BREVO_NEWSLETTER_LIST_ID`: The ID of your Brevo newsletter list
- `EMAIL_FROM`: Sender email address (e.g., letters@rdsafsadf.com)

### 2. Install Dependencies

```bash
npm install
```

### 3. Test the Newsletter

Before setting up the GitHub Action, test the newsletter locally:

```bash
npm run test
```

This will:
- Check all environment variables are set
- Fetch today's letter from Supabase
- Generate the newsletter HTML
- Save it to `test-letter-preview.html` for inspection

### 4. GitHub Actions Setup

1. **Add Secrets to Your Repository:**
   Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `BREVO_API_KEY`
   - `BREVO_NEWSLETTER_LIST_ID`
   - `EMAIL_FROM`

2. **The workflow will automatically run:**
   - Daily at 9:00 AM (schedule in `.github/workflows/daily-newsletter.yml`)
   - You can also trigger it manually via the Actions tab

## Usage

### Manual Execution

```bash
# Build the project
npm run build

# Run the newsletter
npm start
```

### Development

```bash
# Run in development mode (sends actual email)
npm run dev
```

## Newsletter Content

The newsletter includes:

- **Header**: Prabhupada's Letters branding and date
- **Letter Info**: Recipient, location, and date
- **Letter Body**: Full text of the letter in a beautiful format
- **Quote**: Inspirational quote
- **Footer**: Subscription link and unsubscribe option

## Email Design

The newsletter features:
- ✅ Beautiful serif typography for readability
- ✅ Warm color scheme (browns and oranges)
- ✅ Responsive design for mobile and desktop
- ✅ Professional layout with proper spacing
- ✅ Clear call-to-action for new subscriptions
- ✅ Optimized for email clients

## Troubleshooting

### Common Issues

1. **"No letter found for today"**
   - Check your Supabase connection
   - Verify the `month_day` field in your database
   - Run `npm run test` to see which date is being queried

2. **"Missing environment variables"**
   - Ensure all required env vars are set
   - Check GitHub Actions secrets
   - Verify `.env` file exists locally

3. **"Brevo API error"**
   - Verify your Brevo API key
   - Check your newsletter list ID
   - Ensure your sender domain is verified in Brevo

### Logs

The cron job provides detailed logging:
- Supabase connection status
- Letter fetched (recipient, date)
- Email sending status
- Error details if something fails

### Manual Testing

```bash
# Test without sending (generates HTML preview)
npm run test

# Test with actual sending
npm run dev
```

## Customization

### Change Schedule

Edit `.github/workflows/daily-newsletter.yml`:
```yaml
- cron: '0 9 * * *'  # Change to your desired schedule (currently 9 AM UTC)
```

### Update Email Template

Edit `src/templates/letter.ts` to customize:
- Colors and styling
- Layout and content
- Branding elements

### Modify Sender Info

Update in `.env`:
```bash
EMAIL_FROM=your-email@domain.com
```

## Security

- All sensitive data is stored as GitHub Secrets
- No API keys or database credentials in code
- Secure Supabase connection with Row Level Security
- Brevo API key is properly scoped for newsletter sending
- Read-only access to Supabase (using anon key)

## Data Migration

The letters were migrated from text files to Supabase using Python scripts (not included in this repo for security). The migration:
- ✅ Uploaded 6,198 letters
- ✅ Verified 100% daily coverage (366 days)
- ✅ Created proper indexes for fast queries

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Run the test script locally (`npm run test`)
3. Verify all environment variables are set
4. Ensure your Brevo account has proper permissions
5. Check Supabase dashboard for database status

---

**Hare Krishna** 🙏

Built with love for the devotee community.
