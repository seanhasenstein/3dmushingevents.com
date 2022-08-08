import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Event } from '../interfaces';
import { fetchEvents } from '../queries';

export default function useEventsQuery(events?: Event[]) {
  const queryClient = useQueryClient();

  const query = useQuery(['events'], fetchEvents, {
    initialData: events,
    staleTime: 1000 * 60 * 10,
    onSuccess: data => {
      data?.forEach(event => {
        queryClient.setQueryData(['events', 'event', event.tag], event);
      });
    },
  });

  return query;
}
