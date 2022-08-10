import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Stripe from 'stripe';
import { ExtendedNextApiRequest } from '../../interfaces';
import database from '../../middleware/db';

interface Request extends ExtendedNextApiRequest {
  body: {
    amount: number;
  };
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY .env var is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

const handler = nc<Request, NextApiResponse>({
  onError: (err, _req, res) => {
    console.error(err);
    res.status(500).end('Internal server error');
  },
  onNoMatch: (_req, res) => {
    res.status(404).end('Page not found');
  },
})
  .use(database)
  .post(async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'USD',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  });

export default handler;
