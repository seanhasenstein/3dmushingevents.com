import { NextApiResponse } from 'next';
import { connectToDb } from '../db';
import { ExtendedNextApiRequest } from '../interfaces';

export default async function database(
  req: ExtendedNextApiRequest,
  _res: NextApiResponse,
  next: () => void
) {
  const db = await connectToDb();
  req.db = db;

  next();
}
