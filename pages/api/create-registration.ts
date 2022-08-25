import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Stripe from 'stripe';
import {
  ExtendedNextApiRequest,
  InitialFormValues,
  Registration,
} from '../../interfaces';
import { event } from '../../db';
import database from '../../middleware/db';
import { createIdNumber, removeNonDigits } from '../../utils/misc';
import { sendEmail } from '../../utils/mailgun';
import { generateConfirmationEmail } from '../../utils/email';

interface Request extends ExtendedNextApiRequest {
  body: {
    formValues: InitialFormValues;
    eventTag: 'fall' | 'winter';
    payment_method_id: string;
  };
}

interface Accumulator {
  raceIds: string[];
  subtotal: number;
  trailFee: number;
  isdraFee: number;
  total: number;
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY env. variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

const handler = nc<Request, NextApiResponse>({
  onError: (err, _req, res) => {
    const errorMessage =
      err.type === 'StripeCardError' ? err.message : 'Internal server error.';
    res.status(500).end(errorMessage);
  },
  onNoMatch: (_req, res) => {
    res.status(404).end('Page not found');
  },
})
  .use(database)
  .post(async (req, res) => {
    const formValues = req.body.formValues;
    const registrationId = createIdNumber();

    // 1. query for the event from db
    const eventQuery = await event.getEventWithoutRegistrations(
      req.db,
      req.body.eventTag
    );

    // 2. verify the users selected races and totals
    const verified = formValues.races.reduce(
      (accumulator: Accumulator, currentRaceId) => {
        const verifiedEventRace = eventQuery.races.find(
          eventRace => eventRace.id === currentRaceId
        );

        if (verifiedEventRace) {
          const isdraFee = verifiedEventRace.isdraFee
            ? eventQuery.isdraRaceFee
            : 0;
          accumulator.raceIds.push(verifiedEventRace.id);
          accumulator.subtotal += verifiedEventRace.price;
          accumulator.isdraFee += isdraFee;
          accumulator.total += verifiedEventRace.price + isdraFee;
        }

        return accumulator;
      },
      {
        raceIds: [],
        subtotal: 0,
        trailFee: eventQuery.trailFee,
        isdraFee: 0,
        total: eventQuery.trailFee,
      }
    );

    // 3. send payment to stripe
    const stripePaymentIntent = await stripe.paymentIntents.create({
      amount: verified.total,
      currency: 'usd',
      payment_method: req.body.payment_method_id,
      confirm: true,
      error_on_requires_action: true,
      metadata: {
        event: `${eventQuery.tag} [${eventQuery._id}]`,
        registrationId,
        raceIds: verified.raceIds.join(','),
        name: `${formValues.firstName.trim()} ${formValues.lastName.trim()}`,
        hometown: `${formValues.city.trim()}, ${formValues.state}`,
        age: formValues.age,
        gender: formValues.gender,
        guardian: formValues.guardian.trim(),
      },
    });

    if (stripePaymentIntent?.status === 'succeeded') {
      // 4. format registration for db
      const now = new Date().toISOString();
      const registration: Registration = {
        id: registrationId,
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        gender: formValues.gender.trim() as 'male' | 'female',
        email: formValues.email.trim().toLowerCase(),
        phone: removeNonDigits(formValues.phone),
        city: formValues.city.trim(),
        state: formValues.state.trim(),
        age: Number(formValues.age),
        guardian: formValues.guardian.trim(),
        races: verified.raceIds,
        summary: {
          subtotal: verified.subtotal,
          isdraFee: verified.isdraFee,
          trailFee: verified.trailFee,
          total: verified.total,
          stripeFee: Math.round(verified.total * 0.029 + 30),
        },
        stripeId: stripePaymentIntent.id,
        createdAt: now,
        updatedAt: now,
      };

      // 5. add registration to the db
      await event.addRegistrationToEvent(req.db, eventQuery.tag, registration);

      // 6. send confirmation email
      const { text, html, adminTextEmail } = generateConfirmationEmail(
        registration,
        eventQuery
      );
      await sendEmail({
        to: registration.email,
        from: '3D Mushing Events<no-reply@3dmushingevents.com>',
        subject: `${new Date(eventQuery.dates[0]).getFullYear()} ${
          eventQuery.name
        } Registration (#${registrationId})`,
        text,
        html,
      });

      if (!process.env.ADMIN_NOTIFICATION_EMAIL) {
        throw new Error('ADMIN_NOTIFICATION_EMAIL env var is required');
      }

      // 7. send admin notification
      await sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        from: '3D Mushing Events<no-reply@3dmushingevents.com>',
        subject: `${new Date(eventQuery.dates[0]).getFullYear()} ${
          eventQuery.name
        } Registration Notification (#${registrationId})`,
        text: adminTextEmail,
      });

      // 8. return response
      res.json({ success: true, registrationId });
    }
  });

export default handler;
