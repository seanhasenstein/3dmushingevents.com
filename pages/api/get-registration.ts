import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { event } from '../../db';
import {
  ExtendedNextApiRequest,
  RegistrationConfirmation,
} from '../../interfaces';
import database from '../../middleware/db';

interface Request extends ExtendedNextApiRequest {
  query: {
    event: 'fall' | 'winter';
    id: string;
  };
}

const handler = nc<Request, NextApiResponse>({
  onError: (err, _req, res) => {
    res.status(500).end('Internal server error');
  },
  onNoMatch: (_req, res) => {
    res.status(404).end('Page not found');
  },
})
  .use(database)
  .get(async (req, res) => {
    const result = await event.getRegistrationConfirmation(
      req.db,
      req.query.event,
      req.query.id
    );

    if (result.registrations.length === 0) {
      const notFound: RegistrationConfirmation = {
        notFound: true,
        name: result.name,
        dates: result.dates,
        tag: result.tag,
        races: result.races,
        facebookUrl: result.facebookUrl,
      };

      res.json(notFound);
      return;
    }

    const confirmation: RegistrationConfirmation = {
      notFound: false,
      name: result.name,
      dates: result.dates,
      tag: result.tag,
      races: result.races,
      registration: result.registrations[0],
      facebookUrl: result.facebookUrl,
    };

    res.json(confirmation);
  });

export default handler;
