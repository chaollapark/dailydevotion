import { Job } from '../types/job';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://eujobs.co';
const UTM = 'utm_source=newsletter&utm_medium=email&utm_campaign=daily_newsletter';

function newsletterSignupHTML(): string {
  return `
  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;background:#fff;margin:24px 0;text-align:center;">
    <h3 style="margin:0 0 8px 0;color:#111827;font-size:18px;font-weight:700;">
      📧 Share the EUJobs Newsletter
    </h3>
    <p style="margin:0 0 16px 0;color:#374151;font-size:14px;line-height:1.5;">
      Help others discover EU policy career opportunities. Share this newsletter with your network!
    </p>
    <a href="https://abcf680b.sibforms.com/serve/MUIFABgpkc3efdpkZOd_3TtuelFIQxdxhZYGzKGq8wS73V_jWP7rY0HzNMg-EsC6VIz_mZIQpYZDjppbu3FlS0PeFBVdC7YM1AThcniXr5kKcJTcZKAXmJoSiDtsU3u2L27b0VROYX_loiGh2wLuoL1JKNhanZncVKuYi3rNQGwlw-voDu6XyuCR_YiN9t5-Jfvn-Lytjx2oTwBW"
       style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">
       Subscribe to Newsletter
    </a>
  </div>`;
}

export function generateNewsletterHTML(jobs: Job[]): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const jobsHTML = jobs.map((job, index) => `
    <div style="
      border: 1px solid #e5e7eb; 
      border-radius: 8px; 
      padding: 20px; 
      margin-bottom: 20px; 
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    ">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <h3 style="
          margin: 0; 
          color: #1f2937; 
          font-size: 18px; 
          font-weight: 600;
          line-height: 1.4;
        ">${job.title}</h3>
        <span style="
          background-color: ${getSeniorityColor(job.seniority)}; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 4px; 
          font-size: 12px; 
          font-weight: 500;
          text-transform: capitalize;
        ">${job.seniority}</span>
      </div>
      
      <p style="
        margin: 0 0 8px 0; 
        color: #6b7280; 
        font-size: 14px; 
        font-weight: 500;
      ">${job.companyName}</p>
      
      <div style="
        display: flex; 
        gap: 16px; 
        margin-bottom: 16px; 
        font-size: 13px; 
        color: #6b7280;
      ">
        <span>📍 ${job.city || 'Remote'}, ${job.country || 'EU'}</span>
        <span>⏰ ${job.type || 'Full'}-time</span>
        ${job.salary ? `<span>💰 ${formatSalary(job.salary)}</span>` : ''}
      </div>
      
      <div style="display: flex; gap: 12px;">
        <a href="${BASE}/jobs/${job.slug}" 
           style="
             background-color: #3b82f6; 
             color: white; 
             padding: 8px 16px; 
             text-decoration: none; 
             border-radius: 4px; 
             font-weight: 500; 
             font-size: 14px;
             display: inline-block;
           ">View Job</a>
        ${job.applyLink ? `
          <a href="${job.applyLink}" 
             style="
               background-color: #10b981; 
               color: white; 
               padding: 8px 16px; 
               text-decoration: none; 
               border-radius: 4px; 
               font-weight: 500; 
               font-size: 14px;
               display: inline-block;
             ">Apply Now</a>
        ` : ''}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your reminder to apply a job</title>
    </head>
    <body style="
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background-color: #f9fafb;
    ">
      <div style="
        max-width: 600px; 
        margin: 0 auto; 
        background-color: #ffffff; 
        padding: 40px 20px;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="
            margin: 0 0 8px 0; 
            color: #1f2937; 
            font-size: 28px; 
            font-weight: 700;
          ">EUJobs Daily Newsletter</h1>
          <p style="
            margin: 0; 
            color: #6b7280; 
            font-size: 16px;
          ">${currentDate}</p>
        </div>

        <!-- Intro -->
        <div style="
          background-color: #eff6ff; 
          border-left: 4px solid #3b82f6; 
          padding: 16px; 
          margin-bottom: 32px; 
          border-radius: 0 4px 4px 0;
        ">
          <p style="
            margin: 0; 
            color: #1e40af; 
            font-size: 16px; 
            line-height: 1.5;
          ">Here are the <strong>${jobs.length} newest job opportunities</strong> from <a href="${BASE}" style="color: #1e40af; text-decoration: underline;">EUJobs.co</a>. Apply to one job a day - being first is better than being perfect.</p>
        </div>

        <!-- Jobs List -->
        <div style="margin-bottom: 32px;">
          ${jobsHTML}
        </div>


        <!-- Footer -->
        <div style="
          border-top: 1px solid #e5e7eb; 
          padding-top: 24px; 
          text-align: center;
        ">
          <p style="
            margin: 0 0 16px 0; 
            color: #6b7280; 
            font-size: 14px;
          ">Want to see more jobs? Visit our website for the complete listing.</p>
          
          <a href="${BASE}" 
             style="
               background-color: #1f2937; 
               color: white; 
               padding: 12px 24px; 
               text-decoration: none; 
               border-radius: 6px; 
               font-weight: 600; 
               font-size: 16px;
               display: inline-block;
             ">Browse All Jobs</a>
          
          <!-- Newsletter Signup -->
          ${newsletterSignupHTML()}
          
          <div style="margin-top: 24px;">
            <p style="
              margin: 0 0 8px 0; 
              color: #9ca3af; 
              font-size: 12px;
            ">You're receiving this email because you subscribed to the EUJobs newsletter.</p>
            <p style="
              margin: 0; 
              color: #9ca3af; 
              font-size: 12px;
            ">© 2024 <a href="${BASE}" style="color: #9ca3af; text-decoration: underline;">EUJobs.co</a> - Your gateway to EU policy careers</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getSeniorityColor(seniority: string): string {
  const colors = {
    'intern': '#6b7280',
    'junior': '#10b981',
    'mid-level': '#3b82f6',
    'senior': '#8b5cf6'
  };
  return colors[seniority as keyof typeof colors] || '#6b7280';
}

function formatSalary(salary: number): string {
  if (salary >= 1000000) {
    return `${(salary / 1000000).toFixed(1)}M EUR`;
  } else if (salary >= 1000) {
    return `${(salary / 1000).toFixed(0)}K EUR`;
  }
  return `${salary} EUR`;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
