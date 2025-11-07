import { Letter } from '../types/letter';

export function generateLetterHTML(letter: Letter): string {
  const letterDate = new Date(letter.letter_date);
  const formattedDate = letterDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format body paragraphs
  const bodyParagraphs = letter.body
    .split('\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="margin: 0 0 16px 0; line-height: 1.8; color: #374151;">${p.trim()}</p>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Letter from Srila Prabhupada</title>
    </head>
    <body style="
      margin: 0; 
      padding: 0; 
      font-family: Georgia, 'Times New Roman', serif; 
      background-color: #fef3e2;
    ">
      <div style="
        max-width: 650px; 
        margin: 0 auto; 
        background-color: #ffffff; 
        padding: 40px 30px;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #d97706; padding-bottom: 20px;">
          <h1 style="
            margin: 0 0 8px 0; 
            color: #92400e; 
            font-size: 32px; 
            font-weight: 700;
            letter-spacing: 0.5px;
          ">Srila Prabhupada's Letters</h1>
          <p style="
            margin: 0; 
            color: #78716c; 
            font-size: 16px;
            font-style: italic;
          ">${formattedDate}</p>
        </div>

        <!-- Letter Info Card -->
        <div style="
          background: linear-gradient(135deg, #fef3e2 0%, #fde8c7 100%); 
          border-left: 4px solid #d97706; 
          padding: 20px; 
          margin-bottom: 32px; 
          border-radius: 4px;
        ">
          <h2 style="
            margin: 0 0 12px 0; 
            color: #92400e; 
            font-size: 24px; 
            font-weight: 600;
          ">Letter to: ${letter.recipient}</h2>
          <div style="color: #78716c; font-size: 14px; line-height: 1.6;">
            ${letter.location ? `<p style="margin: 0 0 4px 0;"><strong>📍 Location:</strong> ${letter.location}</p>` : ''}
            <p style="margin: 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
          </div>
        </div>

        <!-- Letter Body -->
        <div style="
          padding: 24px; 
          background-color: #fffef9; 
          border-radius: 8px; 
          border: 1px solid #e7e5e4;
          margin-bottom: 32px;
        ">
          <div style="font-size: 16px; line-height: 1.8; color: #1f2937;">
            ${bodyParagraphs}
          </div>
          
          <!-- Signature -->
          <div style="
            margin-top: 32px; 
            padding-top: 20px; 
            border-top: 1px solid #e7e5e4;
            font-style: italic;
            color: #78716c;
          ">
            <p style="margin: 0;">Hare Krishna</p>
          </div>
        </div>

        <!-- Quote Section -->
        <div style="
          background-color: #fef3e2; 
          border-left: 3px solid #d97706; 
          padding: 16px 20px; 
          margin-bottom: 32px;
          border-radius: 0 4px 4px 0;
          text-align: center;
        ">
          <p style="
            margin: 0; 
            color: #92400e; 
            font-size: 14px; 
            line-height: 1.6;
            font-style: italic;
          ">“Supported by 
  <a href="https://vanipedia.com?utm_source=daily-letters&utm_medium=email&utm_campaign=footer"
     style="color:#92400e;text-decoration:underline;">Vanipedia</a>”
</p>

        <!-- Footer -->
        <div style="
          border-top: 2px solid #e7e5e4; 
          padding-top: 24px; 
          text-align: center;
        ">
          <p style="
            margin: 0 0 16px 0; 
            color: #78716c; 
            font-size: 14px;
            line-height: 1.6;
          ">
            🙏 Receive daily wisdom from Srila Prabhupada<br>
            One letter, every day of the year
          </p>
          
          <div style="margin: 24px 0;">
            <p style="
              margin: 0 0 12px 0; 
              color: #78716c; 
              font-size: 13px;
            ">Share this with a fellow devotee:</p>
            <a href="https://7141b09d.sibforms.com/serve/MUIFAFjGyOk37JnE5UafaCj9gc5kthYafB0Uz4I3IaGBXsdGPeYfimjcRqnsbQyu8Mifyz-k7rpY9-KCKt1EPen1KXEXVzHzD21PmuyJhAmVBvoVrN5uXWBHtTDttgRqfsUYqfrYEcMfu1HCu1cDi2K3XYHlxSNR077v8RZvWnuZBsx46Ma2EZafyROA2DDEBKrj6LSiH1IsoCXm"
               style="
                 background-color: #d97706; 
                 color: white; 
                 padding: 12px 28px; 
                 text-decoration: none; 
                 border-radius: 6px; 
                 font-weight: 600; 
                 font-size: 15px;
                 display: inline-block;
               ">Subscribe to Daily Letters</a>
          </div>
          
          <div style="margin-top: 32px;">
            <p style="
              margin: 0 0 8px 0; 
              color: #a8a29e; 
              font-size: 12px;
            ">You're receiving this because you subscribed to Prabhupada's Letters.</p>
            <p style="
              margin: 0; 
              color: #a8a29e; 
              font-size: 12px;
            ">Hare Krishna 🙏 | <a href="{{unsubscribe}}" style="color: #a8a29e; text-decoration: underline;">Unsubscribe</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version for email clients that don't support HTML
 */
export function generateLetterText(letter: Letter): string {
  const letterDate = new Date(letter.letter_date);
  const formattedDate = letterDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
SRILA PRABHUPADA'S LETTERS
${formattedDate}

Letter to: ${letter.recipient}
${letter.location ? `Location: ${letter.location}` : ''}

${letter.body}

---

Hare Krishna 🙏
Receive daily wisdom from Srila Prabhupada
Unsubscribe: {{unsubscribe}}
  `.trim();
}
