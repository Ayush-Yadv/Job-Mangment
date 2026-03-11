import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
}

/**
 * Sends a confirmation email to the candidate after successful application.
 */
export async function sendCandidateConfirmation({ candidateName, candidateEmail, jobTitle }: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not defined. Skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Jobs Management App Careers <onboarding@resend.dev>', // Replace with your verified domain in production
      to: [candidateEmail],
      subject: `Application Received: ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
          <h2 style="color: #4f46e5;">Hi ${candidateName},</h2>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Jobs Management App!</p>
          <p>We've received your application and our team is currently reviewing it. We'll get back to you soon regarding the next steps.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p>Best regards,<br/>The Jobs Management App Recruitment Team</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending candidate confirmation email:', error);
  }
}

/**
 * Sends a notification email to the admin when a new application is received.
 */
export async function sendAdminNotification({ candidateName, candidateEmail, jobTitle }: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not defined. Skipping email.');
    return;
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@jobsmanagement.app'; // Fallback or use env

  try {
    await resend.emails.send({
      from: 'Jobs Management App Careers <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `New Application: ${candidateName} for ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
          <h2 style="color: #4f46e5;">New Application</h2>
          <p>A new candidate has applied for a position.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Candidate:</strong> ${candidateName}</p>
          <p><strong>Email:</strong> ${candidateEmail}</p>
          <p><strong>Job:</strong> ${jobTitle}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/candidates" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Application</a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
}
