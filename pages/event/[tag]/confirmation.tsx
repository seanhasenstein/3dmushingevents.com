import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  formatPhoneNumber,
  formatToMoney,
  getUrlParam,
} from '../../../utils/misc';
import { fetchRegistration } from '../../../queries';
import EventLayout from '../../../components/layouts/EventLayout';
import QueryError from '../../../components/QueryError';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function Confirmation() {
  const router = useRouter();
  const [event, setEvent] = React.useState<'fall' | 'winter'>();
  const [id, setId] = React.useState<string>();

  const { data, isLoading, isError } = useQuery(
    ['registration', id],
    () => fetchRegistration(event, id),
    { staleTime: Infinity, enabled: event !== undefined && id !== undefined }
  );

  React.useEffect(() => {
    if (router.isReady && router.query.tag && router.query.id) {
      const tagParam = getUrlParam(router.query.tag);
      const idParam = getUrlParam(router.query.id);

      if (tagParam !== 'fall' && tagParam !== 'winter') {
        throw new Error('tag url parameter must be either `fall` or `winter`');
      }

      if (!idParam) {
        throw new Error('id url parameter is required');
      }

      setEvent(tagParam);
      setId(idParam);
    }
  }, [router.isReady, router.query.tag, router.query.id]);

  if (isError) {
    return <QueryError />;
  }

  return (
    <EventLayout
      title={isLoading ? 'Loading...' : data ? 'Confirmation' : ''}
      isLoading={isLoading}
      eventTag={data?.tag}
      dates={data?.dates}
      facebookUrl={data?.facebookUrl}
    >
      <ConfirmationStyles>
        {isLoading ? <LoadingSpinner /> : null}
        {data?.notFound ? (
          <div className="not-found">
            <div className="not-found-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h3>Registration not found</h3>
              <p>
                Make sure your registration ID is correct. If you have any
                questions please{' '}
                <Link href="/contact">
                  <a>contact us</a>
                </Link>
                .
              </p>
            </div>
          </div>
        ) : null}

        {!data?.notFound && data?.registration ? (
          <div className="page-container">
            <div className="box-container">
              <div className="instructions">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h4>Registration confirmation</h4>
                <p>
                  We received your registration for {data.name}! You should also
                  receive a confirmation email shortly. If you have any
                  questions please don't hesitate to{' '}
                  <Link href="/contact">
                    <a>contact us</a>
                  </Link>
                  .
                </p>
              </div>
              <div className="section participant-details">
                <div className="item">
                  <div className="label">Registration No:</div>
                  <div className="value">{data.registration.id}</div>
                </div>
                <div className="item">
                  <div className="label">Transaction ID:</div>
                  <div className="value">{data.registration.stripeId}</div>
                </div>
                <div className="item">
                  <div className="label">Date:</div>
                  <div className="value">
                    {format(
                      new Date(data.registration.createdAt),
                      "P 'at' hh:mm:ssaa"
                    )}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Name:</div>
                  <div className="value">
                    {data.registration.firstName} {data.registration.lastName}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Hometown:</div>
                  <div className="value">
                    {data.registration.city}, {data.registration.state}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Age/Gender:</div>
                  <div className="value">
                    <span className="capitalize">
                      {data.registration.gender}
                    </span>{' '}
                    - {data.registration.age}
                  </div>
                </div>
                {data.registration.guardian ? (
                  <div className="item">
                    <div className="label">Guardian:</div>
                    <div className="value">{data.registration.guardian}</div>
                  </div>
                ) : null}
                <div className="item">
                  <div className="label">Email:</div>
                  <div className="value">{data.registration.email}</div>
                </div>
                <div className="item">
                  <div className="label">Phone:</div>
                  <div className="value">
                    {formatPhoneNumber(data.registration.phone)}
                  </div>
                </div>
              </div>

              <div className="section">
                <h4>
                  Race
                  {data.registration.races.length > 1 ? 's' : ''}
                </h4>
                {data.registration.races.map(r => {
                  const race = data.races.find(cr => cr.id == r);

                  return (
                    <div key={r} className="race-item">
                      <div className="race-name">
                        {race?.sled} - {race?.category}
                        {race?.breed ? ` - ${race.breed}` : null}
                      </div>
                      <div className="race-price">
                        {race && formatToMoney(race.price)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="section summary-section">
                <div className="summary-item">
                  <div className="label">Subtotal</div>
                  <div className="value">
                    {formatToMoney(data.registration.summary.subtotal, true)}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="label">Trail fee</div>
                  <div className="value">
                    {formatToMoney(data.registration.summary.trailFee, true)}
                  </div>
                </div>
                {data.registration.summary.isdraFee ? (
                  <div className="summary-item">
                    <div className="label">ISDRA fee</div>
                    <div className="value">
                      {formatToMoney(data.registration.summary.isdraFee, true)}
                    </div>
                  </div>
                ) : null}
                <div className="summary-item total">
                  <div className="label">Total</div>
                  <div className="value">
                    {formatToMoney(data.registration.summary.total, true)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </ConfirmationStyles>
    </EventLayout>
  );
}

const ConfirmationStyles = styled.div`
  padding: 3rem 1.5rem 5rem;
  position: relative;

  .page-container {
    margin: 0 auto;
    max-width: 40rem;
    width: 100%;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .box-container {
    padding: 2.5rem 3.75rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.125rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .instructions {
    margin: 0 0 3rem;
    text-align: center;

    svg {
      height: 2.5rem;
      width: 2.5rem;
      color: #047857;
    }

    h4 {
      margin: 0.75rem 0 0;
      font-size: 1.125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #111827;
    }

    p {
      margin: 0.875rem 0 0;
      font-size: 1rem;
      font-weight: 500;
      color: #4b5563;
      line-height: 1.5;

      a {
        text-decoration: underline;
        transition: color 100ms linear;

        &:hover {
          color: #374151;
        }
      }
    }
  }

  .section {
    margin: 2.5rem 0 0;
  }

  .participant-details {
    .item {
      padding: 0.25rem 0;
      display: grid;
      grid-template-columns: 12rem 1fr;

      &:first-of-type {
        padding-top: 0;
      }

      .label {
        font-weight: 500;
        color: #111827;
      }

      .value {
        font-weight: 500;
        color: #4b5563;
      }
    }
  }

  .race-item {
    padding: 0.1875rem 0;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #4b5563;

    &:first-of-type {
      margin: 0.375rem 0 0;
    }
  }

  .summary-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .summary-item {
    padding: 0.25rem 0;
    max-width: 13rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 500;
    color: #4b5563;

    &.total {
      font-weight: 600;
      color: #000;
    }
  }

  .not-found {
    display: flex;
    justify-content: center;

    .not-found-container {
      padding: 2rem 2rem 3rem;
      max-width: 30rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.125rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      text-align: center;
    }

    h3 {
      margin: 0.25rem 0 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    p {
      margin: 1rem auto 0;
      max-width: 26rem;
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.5;
    }

    .icon {
      height: 1.875rem;
      width: 1.875rem;
      color: #be123c;
    }

    a {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    padding: 1.5rem 1.5rem 5rem;

    .box-container {
      padding: 2.5rem 1.3125rem;
    }

    .actions-row {
      padding: 1.5rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #dadde2;
    }

    .participant-details .item {
      padding: 0.75rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      word-wrap: break-word;
    }

    .summary-section {
      align-items: flex-start;
    }

    .summary-item {
      max-width: unset;
    }
  }
`;
