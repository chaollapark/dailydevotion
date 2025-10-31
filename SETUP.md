# Quick Setup Guide

## ✅ What's Already Done

- ✅ 6,198 letters uploaded to Supabase
- ✅ All 366 days of the year covered
- ✅ Database indexed for fast queries
- ✅ Code adapted from newsletter project
- ✅ Brevo integration ready

## 🚀 Setup Steps (5 minutes)

### 1. Install Dependencies

```bash
cd /Users/madan/Code/scraper2/prabhupada-letters-cron
npm install
```

### 2. Create `.env` File

```bash
cp env.example .env
```

Then edit `.env` and add your Brevo credentials:

```bash
# Supabase (already filled in)
SUPABASE_URL=https://ljhaaqjsjyynrccmrnsc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Brevo (GET THESE FROM BREVO)
BREVO_API_KEY=your_brevo_api_key_here         # Get from Brevo → Settings → API Keys
BREVO_NEWSLETTER_LIST_ID=123                   # Your list ID number

# Email
EMAIL_FROM=letters@radhadesh.com               # Your verified sender email
```

### 3. Test It

```bash
# Test without sending (generates HTML preview)
npm run test
```

This will:
- ✅ Check all environment variables
- ✅ Fetch today's letter from Supabase
- ✅ Generate `test-letter-preview.html`
- Open the HTML file in your browser to see how it looks!

### 4. Send Test Email

```bash
# Send actual email to your Brevo list
npm run dev
```

Check your inbox! 📧

### 5. Deploy to GitHub Actions

1. Push to GitHub
2. Add secrets in GitHub → Settings → Secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `BREVO_API_KEY`
   - `BREVO_NEWSLETTER_LIST_ID`
   - `EMAIL_FROM`

3. Done! It will run daily at 9 AM.

## 📋 Getting Brevo Credentials

### Brevo API Key
1. Go to https://app.brevo.com
2. Click **Settings** (gear icon)
3. Click **API Keys**
4. Click **Generate a new API key**
5. Copy the key

### Brevo List ID
1. Go to **Contacts** → **Lists**
2. Create a new list called "Daily Letter Subscribers"
3. Click on the list
4. The URL will show: `https://app.brevo.com/contact/list/id/123`
5. That number (`123`) is your list ID

## 🧪 Testing

```bash
# Build
npm run build

# Test (no sending)
npm run test

# Dev (sends email)
npm run dev

# Production
npm start
```

## 📝 Next Steps

1. ✅ Test locally
2. ✅ Verify email looks good
3. ✅ Deploy to GitHub
4. ✅ Set up GitHub secrets
5. ✅ Wait for first automated send at 9 AM!

---

**Need help?** Check README.md for detailed documentation.

