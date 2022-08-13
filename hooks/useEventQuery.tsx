import { useQuery } from '@tanstack/react-query';
import { Event } from '../interfaces';
import { fetchEvent } from '../queries';

export default function useEventQuery(
  eventTag: 'fall' | 'winter' | undefined,
  events?: Event[]
) {
  const query = useQuery(
    ['events', 'event', eventTag],
    () => fetchEvent(eventTag),
    {
      initialData: events?.find(event => event.tag === eventTag),
      staleTime: 1000 * 60 * 10,
      enabled: eventTag !== undefined,
    }
  );

  return query;
}
