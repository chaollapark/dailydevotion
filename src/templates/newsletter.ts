import { Job } from '../types/job';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://eujobs.co';
const UTM = 'utm_source=newsletter&utm_medium=email&utm_campaign=apply_with_ai';

function aiPromoHTML(position: 'hero'|'mid'|'footer' = 'hero'): string {
  const wrapPad = position === 'footer' ? '16px' : '20px';
  const titleSize = position === 'hero' ? '18px' : '16px';
  const subSize = '14px';
  return `
  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:${wrapPad};background:#fff;margin:${position==='mid'?'24px 0':'0 0 32px 0'}">
    <h3 style="margin:0 0 6px 0;color:#111827;font-size:${titleSize};font-weight:700;">
      Apply with AI — 100 applications for €100
    </h3>
    <p style="margin:0 0 12px 0;color:#374151;font-size:${subSize};line-height:1.5;">
      On average drafting a job application takes an hour. How much is that worth to you?
    </p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
      <a href="${BASE}/apply-with-ai?plan=100&${UTM}&utm_content=${position}"
         style="background:#16a34a;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
         Start 100 for €100
      </a>
      <a href="${BASE}/apply-with-ai?plan=25&${UTM}&utm_content=${position}"
         style="background:#111827;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
         Starter: 25 for €50
      </a>
    </div>
    <p style="margin:0;color:#6b7280;font-size:12px;">
      You approve every send · 7-day turnaround · On EUJobs & partners only · Refund/extend if we don't deliver.
    </p>
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
      
      <div style="
        color: #374151; 
        font-size: 14px; 
        line-height: 1.6; 
        margin-bottom: 16px;
        max-height: 80px; 
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      ">${stripHtmlTags(job.description).substring(0, 200)}${stripHtmlTags(job.description).length > 200 ? '...' : ''}</div>
      
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
    ${index === 0 ? `
    <!-- AI Promo as Job Posting (after first job) -->
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
        ">Apply with AI — 100 applications for €100</h3>
        <span style="
          background-color: #16a34a; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 4px; 
          font-size: 12px; 
          font-weight: 500;
          text-transform: capitalize;
        ">AI Service</span>
      </div>
      
      <p style="
        margin: 0 0 8px 0; 
        color: #6b7280; 
        font-size: 14px; 
        font-weight: 500;
      ">EUJobs.co</p>
      
      <div style="
        color: #374151; 
        font-size: 14px; 
        line-height: 1.6; 
        margin-bottom: 16px;
      ">The first 5% of applicant are 13x more likely to get a job. Making the perfect application isn't as important as being one of the first applicants.</div>
      
      <div style="display: flex; gap: 12px;">
        <a href="${BASE}/apply-with-ai?plan=100&${UTM}&utm_content=job_posting" 
           style="
             background-color: #16a34a; 
             color: white; 
             padding: 8px 16px; 
             text-decoration: none; 
             border-radius: 4px; 
             font-weight: 500; 
             font-size: 14px;
             display: inline-block;
           ">Start 100 for €100</a>
        <a href="${BASE}/apply-with-ai?plan=25&${UTM}&utm_content=job_posting" 
           style="
             background-color: #111827; 
             color: white; 
             padding: 8px 16px; 
             text-decoration: none; 
             border-radius: 4px; 
             font-weight: 500; 
             font-size: 14px;
             display: inline-block;
           ">Starter: 25 for €50</a>
      </div>
      <p style="
        margin: 8px 0 0 0; 
        color: #6b7280; 
        font-size: 12px;
      ">You approve every send · 7-day turnaround · On EUJobs & partners only · Refund/extend if we don't deliver.</p>
    </div>
    ` : ''}
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EUJobs Daily Newsletter</title>
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
          ">Here are the <strong>${jobs.length} newest job opportunities</strong> from <a href="${BASE}" style="color: #1e40af; text-decoration: underline;">EUJobs.co</a>. Find your next career move in EU policy, advocacy, and public affairs!</p>
        </div>

        <!-- Jobs List -->
        <div style="margin-bottom: 32px;">
          ${jobsHTML}
        </div>

        <!-- AI Promo Mid -->
        ${aiPromoHTML('mid')}

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
