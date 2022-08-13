import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { format } from 'date-fns';
import { getUrlParam } from '../../../utils/misc';
import useEventQuery from '../../../hooks/useEventQuery';
import Layout from '../../../components/Layout';
import RegistrationForm from '../../../components/RegistrationForm';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('Failed to load Stripe. Please reload the page.');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY, {
  apiVersion: '2022-08-01',
});

export default function Register() {
  const router = useRouter();
  const query = useEventQuery(
    getUrlParam(router.query.tag) as 'fall' | 'winter' | undefined
  );

  const options = {
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Layout
      title={query.isLoading ? 'Loading...' : query.data ? query.data.name : ''}
    >
      <RegisterStyles>
        <Elements options={options} stripe={stripePromise}>
          {query.isError ? 'TODO: add an error message' : null}
          {query.data ? (
            <div className="page-container">
              <Link href={`/event/${query.data.tag}`}>
                <a className="back-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back to event page
                </a>
              </Link>
              <div className="header">
                <img
                  src={`../../${query.data.tag}-logo.png`}
                  alt={`${query.data.name} logo`}
                  className="logo"
                />
                <h2>
                  <span>Registration</span> {query.data.name}
                </h2>
                <p className="dates">
                  {format(new Date(query.data.dates[0]), 'EEEE M/d, yyyy')} -{' '}
                  {format(
                    new Date(query.data.dates[query.data.dates.length - 1]),
                    'EEEE M/d, yyyy'
                  )}
                </p>
              </div>
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
  padding: 3rem 1.5rem 5rem;
  position: relative;

  .back-link {
    position: absolute;
    top: 2rem;
    left: 2.5rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    transition: color 100ms linear;

    &:hover {
      color: #111827;

      svg {
        transform: translateX(-1px);
      }
    }

    svg {
      margin: 0 0.375rem 0 0;
      height: 1rem;
      width: 1rem;
      color: #9ca3af;
    }
  }

  .page-container {
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    width: 6rem;
  }

  h2 {
    margin: 1rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;

    span {
      margin: 0 0 0.625rem;
      display: block;
      font-size: 1.125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .dates {
    margin: 1.125rem auto 0;
    display: inline-flex;
    padding: 0.375rem 0.875rem;
    background-color: #1f2937;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #f3f4f6;
    line-height: initial;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form {
    margin: 3rem 0 0;
  }

  @media (max-width: 640px) {
    padding: 5rem 1.5rem;

    .back-link {
      padding: 0.25rem 0;
      top: 2rem;
      left: calc(50% - 6rem);
      width: 12rem;
      justify-content: center;
    }
  }

  @media (max-width: 375px) {
    .dates {
      font-size: 0.5625rem;
    }
  }
`;
