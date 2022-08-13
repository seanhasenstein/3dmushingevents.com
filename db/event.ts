import { Db } from 'mongodb';
import { Event, Registration } from '../interfaces';

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

export async function getRegistrationConfirmation(
  db: Db,
  event: 'fall' | 'winter',
  id: string
) {
  const result = await db
    .collection(collections.events)
    .aggregate<Event>([
      { $match: { tag: event } },
      {
        $project: {
          _id: 0,
          name: 1,
          tag: 1,
          dates: 1,
          races: 1,
          registrations: {
            $filter: {
              input: '$registrations',
              as: 'registration',
              cond: { $eq: ['$$registration.id', id] },
            },
          },
        },
      },
    ])
    .toArray();

  return result[0];
}

export async function addRegistrationToEvent(
  db: Db,
  event: 'fall' | 'winter',
  registration: Registration
) {
  const result = await db
    .collection<Event>(collections.events)
    .findOneAndUpdate(
      { tag: event },
      { $push: { registrations: registration } },
      { returnDocument: 'after' }
    );
  return result.value;
}
