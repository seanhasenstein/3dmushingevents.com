import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const authToken = `Basic ${Buffer.from(
  `api:${process.env.MAILGUN_API_KEY}`
).toString('base64')}`;

interface SendEmailInput {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  bcc?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  bcc,
  replyTo,
}: SendEmailInput) {
  const form = new FormData();
  const endpoint = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;

  form.append('to', to);
  form.append('from', from);
  form.append('subject', subject);
  form.append('text', text);

  if (html) form.append('html', html);
  if (bcc) form.append('bcc', bcc);
  if (replyTo) form.append('h:Reply-To', replyTo);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: authToken,
    },
  });

  const data = await response.json();

  return data;
}
