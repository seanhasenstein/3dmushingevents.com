import { Db } from 'mongodb';
import { Event } from '../interfaces';

const collections = {
  events: 'events',
};

export async function getAllEventsWithoutRegistrations(db: Db) {
  const result = await db
    .collection(collections.events)
    .aggregate<Event>([
      { $set: { _id: { $toString: '$_id' } } },
      { $project: { registrations: 0 } },
    ])
    .toArray();
  return result;
}

export async function getEventWithoutRegistrations(
  db: Db,
  event: 'fall' | 'winter'
) {
  const result = await db
    .collection(collections.events)
    .aggregate<Event>([
      { $match: { tag: event } },
      { $set: { _id: { $toString: '$_id' } } },
      { $project: { registrations: 0 } },
    ])
    .toArray();

  return result[0];
}
