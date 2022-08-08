import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { event } from '../../db';
import { ExtendedNextApiRequest } from '../../interfaces';
import database from '../../middleware/db';

const handler = nc<ExtendedNextApiRequest, NextApiResponse>({
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
    const result = await event.getAllEventsWithoutRegistrations(req.db);
    res.json(result);
  });

export default handler;
