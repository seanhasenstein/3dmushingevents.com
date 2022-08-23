import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { ExtendedNextApiRequest } from '../../interfaces';
import { createIdNumber, formatPhoneNumber } from '../../utils/misc';
import { sendEmail } from '../../utils/mailgun';
import { generateContactFormEmail } from '../../utils/email';

interface Request extends ExtendedNextApiRequest {
  body: {
    name: string;
    email: string;
    phone: string;
    message: string;
    hp: string;
  };
}

const handler = nc<Request, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err);
    res.status(500).end('Internal server error');
  },
  onNoMatch: (_req, res) => {
    res.status(404).end('Page not found');
  },
}).post(async (req, res) => {
  if (req.body.hp !== '') {
    res.json({ message: 'honeypot triggered' });
    return;
  }

  const message = {
    id: createIdNumber(),
    name: req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
    phone: formatPhoneNumber(req.body.phone),
    message: req.body.message.trim(),
  };

  if (!process.env.CONTACT_FORM_TO_EMAIL) {
    throw new Error('process.env.CONTACT_FORM_TO_EMAIL is required.');
  }

  await sendEmail({
    to: process.env.CONTACT_FORM_TO_EMAIL,
    from: '3D Mushing Events<support@3dmushingevents.com>',
    subject: `Contact form message (#${message.id})`,
    replyTo: message.email,
    text: generateContactFormEmail(message),
  });

  res.json({ success: true });
});

export default handler;
