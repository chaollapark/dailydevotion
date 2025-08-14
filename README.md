# EUJobs Daily Newsletter Cron Job

This is a standalone cron job that sends daily newsletters to Brevo subscribers with the 10 newest jobs from the EUJobs.co database.

## Features

- 🕘 Runs daily at 9:00 AM EU time via GitHub Actions
- 📧 Sends beautiful HTML newsletters to Brevo subscribers
- 🎯 Prioritizes pro/recruiter jobs in the newsletter
- 📱 Responsive email design that works on all devices
- 🔧 Easy to test and deploy
- 📊 Comprehensive logging and error handling

## Setup

### 1. Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required environment variables:

- `MONGODB_URI`: Your MongoDB connection string
- `BREVO_API_KEY`: Your Brevo API key
- `BREVO_NEWSLETTER_LIST_ID`: The ID of your Brevo newsletter list
- `EMAIL_FROM`: Sender email address (e.g., noreply@eujobs.online)
- `NEXT_PUBLIC_BASE_URL`: Your website URL (e.g., https://eujobs.co)

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
- Fetch the latest 5 jobs from your database
- Generate the newsletter HTML
- Save it to `test-newsletter.html` for inspection
- Check that all environment variables are set

### 4. GitHub Actions Setup

1. **Add Secrets to Your Repository:**
   Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:
   - `MONGODB_URI`
   - `BREVO_API_KEY`
   - `BREVO_NEWSLETTER_LIST_ID`
   - `EMAIL_FROM`
   - `NEXT_PUBLIC_BASE_URL`

2. **The workflow will automatically run:**
   - Daily at 9:00 AM EU time (8:00 AM UTC)
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
# Run in development mode
npm run dev
```

## Newsletter Content

The newsletter includes:

- **Header**: EUJobs branding and current date
- **Introduction**: Brief overview of the jobs
- **Job Listings**: Up to 10 newest jobs with:
  - Job title and company
  - Location and job type
  - Salary (if available)
  - Seniority level with color coding
  - Brief description preview
  - View and Apply buttons
- **Footer**: Links to browse all jobs and unsubscribe info

## Job Prioritization

The newsletter prioritizes jobs in this order:
1. **Pro/Recruiter jobs** (featured positions)
2. **Other jobs** (basic, unlimited plans)

This ensures your premium job postings get maximum visibility.

## Email Design

The newsletter features:
- ✅ Responsive design for mobile and desktop
- ✅ Professional EUJobs branding
- ✅ Clear call-to-action buttons
- ✅ Color-coded seniority badges
- ✅ Clean, readable typography
- ✅ Optimized for email clients

## Troubleshooting

### Common Issues

1. **"No jobs found"**
   - Check your MongoDB connection
   - Verify jobs exist in your database

2. **"Missing environment variables"**
   - Ensure all required env vars are set
   - Check GitHub Actions secrets

3. **"Brevo API error"**
   - Verify your Brevo API key
   - Check your newsletter list ID
   - Ensure your sender domain is verified

### Logs

The cron job provides detailed logging:
- Database connection status
- Number of jobs fetched
- Email sending status
- Error details if something fails

### Manual Testing

```bash
# Test with a smaller job count
npm run test
```

This will fetch only 5 jobs and save the HTML for inspection.

## Customization

### Modify Job Count

Edit `src/index.ts`:
```typescript
const jobs = await fetchLatestJobs(10); // Change 10 to desired number
```

### Update Email Template

Edit `src/templates/newsletter.ts` to customize:
- Colors and styling
- Layout and content
- Branding elements

### Change Schedule

Edit `.github/workflows/daily-newsletter.yml`:
```yaml
- cron: '0 8 * * *'  # Change to your desired schedule
```

## Security

- All sensitive data is stored as GitHub Secrets
- No API keys or database credentials in code
- Secure MongoDB connection with proper authentication
- Brevo API key is properly scoped for newsletter sending

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Run the test script locally
3. Verify all environment variables are set
4. Ensure your Brevo account has proper permissions

---

**Note**: This cron job is designed to be a standalone component that you can easily move to a separate repository or deploy independently.
