import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../../../components/Layout';
import useEventQuery from '../../../hooks/useEventQuery';
import { getUrlParam } from '../../../utils/misc';

export default function Event() {
  const router = useRouter();
  const [eventTag, setEventTag] = React.useState<'fall' | 'winter'>();
  const query = useEventQuery(eventTag);

  React.useEffect(() => {
    if (router.isReady && router.query.tag) {
      const tag = getUrlParam(router.query.tag);

      if (tag === 'fall' || tag === 'winter') {
        setEventTag(tag);
      }
    }
  }, [router.isReady, router.query.tag]);

  return (
    <Layout
      title={query.isLoading ? 'Loading...' : query.data ? query.data.name : ''}
    >
      <EventStyles>
        {query.isLoading ? 'Loading...' : null}
        {query.isError ? 'TODO: add error handling...' : null}
        {query.data ? (
          <>
            <h2>This will be the event template...</h2>
            <Link href={`/event/${eventTag}/register`}>
              <a>Register now</a>
            </Link>
            <pre>{JSON.stringify(query.data, null, 2)}</pre>
          </>
        ) : null}
      </EventStyles>
    </Layout>
  );
}

const EventStyles = styled.div``;
