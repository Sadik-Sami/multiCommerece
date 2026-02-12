import { env } from '@multiCommerece/env/server';
import { resend } from './resend';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const fromEmail = env.RESEND_FROM_EMAIL;

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
