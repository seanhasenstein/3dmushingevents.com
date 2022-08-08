import { Event } from '../interfaces';

export async function fetchEvents() {
  const response = await fetch('/api/get-events');

  if (!response.ok) {
    throw new Error('Failed to fetch the events');
  }

  const data: Event[] = await response.json();
  return data;
}

export async function fetchEvent(event: 'fall' | 'winter' | undefined) {
  if (!event) return;
  const response = await fetch(`/api/get-event?event=${event}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch the ${event} event`);
  }

  const data: Event = await response.json();
  return data;
}
