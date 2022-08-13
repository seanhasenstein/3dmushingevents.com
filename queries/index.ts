import { Confirmation, Either, Event, InitialFormValues } from '../interfaces';

export async function fetchEvents() {
  const response = await fetch('/api/get-events');

  if (!response.ok) {
    throw new Error('Failed to fetch the events');
  }

  const data: Event[] = await response.json();
  return data;
}

export async function fetchEvent(event: 'fall' | 'winter' | undefined) {
  const response = await fetch(`/api/get-event?event=${event}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch the ${event} event`);
  }

  const data: Event = await response.json();
  return data;
}

type Data = Either<{ confirmation: Confirmation }, { notFound: boolean }>;

export async function fetchRegistration(
  event: 'fall' | 'winter' | undefined,
  id: string | undefined
) {
  const response = await fetch(`/api/get-registration?event=${event}&id=${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch the ${event} registration id: ${id}`);
  }

  const data: Data = await response.json();
  return data;
}

export async function createRegistrationFetch(
  formValues: InitialFormValues,
  eventTag: 'fall' | 'winter',
  payment_method_id: string
) {
  const response = await fetch('/api/create-registration', {
    method: 'POST',
    body: JSON.stringify({ formValues, eventTag, payment_method_id }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data: { success: boolean; registrationId: string } =
    await response.json();
  return data;
}
