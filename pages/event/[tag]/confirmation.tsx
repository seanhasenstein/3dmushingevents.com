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
import Layout from '../../../components/Layout';

export default function Confirmation() {
  const router = useRouter();
  const [event, setEvent] = React.useState<'fall' | 'winter'>();
  const [id, setId] = React.useState<string>();

  const { data, isLoading, isError } = useQuery(
    ['registration', id],
    () => fetchRegistration(event, id),
    { staleTime: Infinity }
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

  return (
    <Layout title={isLoading ? 'Loading...' : data ? 'Confirmation' : ''}>
      <ConfirmationStyles>
        {isLoading ? 'Loading...' : null}
        {/* TODO: style the error message */}
        {isError ? 'Internal server error' : null}
        {/* TODO: style the not found message */}
        {data?.notFound ? 'Registration not found' : null}

        {data?.confirmation ? (
          <div className="container">
            <div className="header">
              <img
                src={`../../${data.confirmation.tag}-logo.png`}
                alt={data.confirmation.name}
                className="logo"
              />
              <h2>{data.confirmation.name}</h2>
              <p className="dates">
                {format(new Date(data.confirmation.dates[0]), 'EEEE M/d, yyyy')}{' '}
                -{' '}
                {format(
                  new Date(
                    data.confirmation.dates[data.confirmation.dates.length - 1]
                  ),
                  'EEEE M/d, yyyy'
                )}
              </p>
            </div>
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
                  We received your registration for {data.confirmation.name}!
                  You should also receive a confirmation email shortly. If you
                  have any questions please don&apos;t hesitate to{' '}
                  <Link href="/contact">
                    <a>contact us</a>
                  </Link>
                  .
                </p>
              </div>
              <div className="section participant-details">
                <div className="item">
                  <div className="label">Registration No:</div>
                  <div className="value">
                    {data.confirmation.registration.id}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Transaction ID:</div>
                  {/* TODO: add real stripeId */}
                  <div className="value">pi_3LV0XSEAYVqQ2HpH1UajE3d6</div>
                </div>
                <div className="item">
                  <div className="label">Date:</div>
                  <div className="value">
                    {format(
                      new Date(data.confirmation.registration.createdAt),
                      "P 'at' hh:mm:ssaa"
                    )}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Name:</div>
                  <div className="value">
                    {data.confirmation.registration.firstName}{' '}
                    {data.confirmation.registration.lastName}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Hometown:</div>
                  <div className="value">
                    {data.confirmation.registration.city},{' '}
                    {data.confirmation.registration.state}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Age/Gender:</div>
                  <div className="value">
                    <span className="capitalize">
                      {data.confirmation.registration.gender}
                    </span>{' '}
                    - {data.confirmation.registration.age}
                  </div>
                </div>
                {data.confirmation.registration.guardian ? (
                  <div className="item">
                    <div className="label">Guardian:</div>
                    <div className="value">
                      {data.confirmation.registration.guardian}
                    </div>
                  </div>
                ) : null}
                <div className="item">
                  <div className="label">Email:</div>
                  <div className="value">
                    {data.confirmation.registration.email}
                  </div>
                </div>
                <div className="item">
                  <div className="label">Phone:</div>
                  <div className="value">
                    {formatPhoneNumber(data.confirmation.registration.phone)}
                  </div>
                </div>
              </div>

              <div className="section">
                <h4>
                  Race
                  {data.confirmation.registration.races.length > 1 ? 's' : ''}
                </h4>
                {data.confirmation.registration.races.map(r => {
                  const race = data.confirmation.races.find(cr => cr.id == r);

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
              <div className="section">
                <h4>Summary</h4>
                <div className="summary-item">
                  <div className="label">Subtotal</div>
                  <div className="value">
                    {formatToMoney(
                      data.confirmation.registration.summary.subtotal,
                      true
                    )}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="label">Trail fee</div>
                  <div className="value">
                    {formatToMoney(
                      data.confirmation.registration.summary.trailFee,
                      true
                    )}
                  </div>
                </div>
                {data.confirmation.registration.summary.isdraFee ? (
                  <div className="summary-item">
                    <div className="label">ISDRA fee</div>
                    <div className="value">
                      {formatToMoney(
                        data.confirmation.registration.summary.isdraFee,
                        true
                      )}
                    </div>
                  </div>
                ) : null}
                <div className="summary-item total">
                  <div className="label">Total</div>
                  <div className="value">
                    {formatToMoney(
                      data.confirmation.registration.summary.total,
                      true
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </ConfirmationStyles>
    </Layout>
  );
}

const ConfirmationStyles = styled.div`
  padding: 3rem 1.5rem 5rem;

  .container {
    margin: 0 auto;
    max-width: 40rem;
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
    margin: 0.75rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
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

  .box-container {
    margin: 2.5rem 0 0;
    padding: 2.5rem 3.75rem;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
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
      margin: 1rem 0 0;
      color: #6b7280;
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
        color: #374151;
      }
    }
  }

  .race-item {
    padding: 0.1875rem 0;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    font-size: 1rem;
    color: #374151;

    &:first-of-type {
      margin: 0.375rem 0 0;
    }
  }

  .summary-item {
    padding: 0.1875rem 0;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    color: #374151;

    &:first-of-type {
      margin: 0.375rem 0 0;
    }

    &.total {
      font-weight: 600;
      color: #111827;
    }
  }

  @media (max-width: 640px) {
    .box-container {
      padding: 2.5rem 1.3125rem;
    }

    .participant-details .item {
      padding: 0.75rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      word-wrap: break-word;
      /* text-align: center; */
    }
  }

  @media (max-width: 375px) {
    .dates {
      font-size: 0.5625rem;
    }
  }
`;
