import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { event } from '../../db';
import { ExtendedNextApiRequest } from '../../interfaces';
import database from '../../middleware/db';

interface Request extends ExtendedNextApiRequest {
  query: {
    event: 'fall' | 'winter';
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
})
  .use(database)
  .get(async (req, res) => {
    const result = await event.getEventWithoutRegistrations(
      req.db,
      req.query.event
    );
    res.json(result);
  });

export default handler;
