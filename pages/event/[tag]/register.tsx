import React from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { getUrlParam } from '../../../utils/misc';
import useEventQuery from '../../../hooks/useEventQuery';
import Layout from '../../../components/layouts/EventLayout';
import RegistrationForm from '../../../components/RegistrationForm';
import QueryError from '../../../components/QueryError';
import LoadingSpinner from '../../../components/LoadingSpinner';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is required in env vars');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY, {
  apiVersion: '2022-08-01',
});

export default function Register() {
  const router = useRouter();
  const query = useEventQuery(
    getUrlParam(router.query.tag) as 'fall' | 'winter' | undefined
  );

  // obj for Stripe Elements
  const options = {
    appearance: {
      theme: 'stripe' as const,
    },
  };

  if (query.isError) {
    return <QueryError />;
  }

  return (
    <Layout
      title={query.isLoading ? 'Loading...' : query.data ? query.data.name : ''}
      isLoading={query.isLoading}
      eventTag={query.data?.tag}
      dates={query.data?.dates}
      facebookUrl={query.data?.facebookUrl}
    >
      <RegisterStyles>
        {query.isLoading ? <LoadingSpinner /> : null}
        <Elements options={options} stripe={stripePromise}>
          {query.data ? (
            <div className="page-container">
              <div className="form">
                <RegistrationForm event={query.data} />
              </div>
            </div>
          ) : null}
        </Elements>
      </RegisterStyles>
    </Layout>
  );
}

const RegisterStyles = styled.div`
  padding: 3.5rem 1.5rem 5rem;
  position: relative;

  .page-container {
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    padding-top: 3rem;
  }
`;
