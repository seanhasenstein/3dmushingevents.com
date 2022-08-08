import { mongoClientPromise } from './connect';
import * as event from './event';

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export { connectToDb, event };
