import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import useEventsQuery from '../hooks/useEventsQuery';
import Layout from '../components/Layout';

export default function FourOhFour() {
  const query = useEventsQuery();

  return (
    <Layout title="404 Error">
      <FourOhFourStyles>
        {query.data ? (
          <div className="container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2>404 Error</h2>
            <p>Sorry, the page you are looking for doesn&apos;t exist.</p>
            <div className="flex-row">
              {query.data.map(event => (
                <div key={event._id} className="event">
                  <img
                    src={`./${event.tag}-logo.png`}
                    alt={`${event.name}  logo`}
                  />
                  <h3>{event.name}</h3>
                  <p className="dates">
                    {format(new Date(event.dates[0]), 'iii M/d, yyyy')} -{' '}
                    {format(
                      new Date(event.dates[event.dates.length - 1]),
                      'iii M/d, yyyy'
                    )}
                  </p>
                  <Link href={`/event/${event.tag}`}>
                    <a className="event-link">Event home</a>
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/">
              <a className="home-link">Back to the homepage</a>
            </Link>
          </div>
        ) : null}
      </FourOhFourStyles>
    </Layout>
  );
}

const FourOhFourStyles = styled.div`
  padding: 6rem 1.5rem 4rem;
  text-align: center;

  .container {
    margin: 0 auto;
    max-width: 56rem;
    width: 100%;
  }

  svg {
    height: 2.5rem;
    width: 2.5rem;
    color: #9ca3af;
  }

  h2 {
    margin: 0.5rem 0 0;
    font-size: 1.5rem;
  }

  p {
    margin: 1.125rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
  }

  .flex-row {
    margin: 3rem 0 0;
    display: flex;
    gap: 1.25rem;
  }

  .event {
    padding: 1.5rem 2.5rem;
    width: 100%;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

    img {
      width: 4.5rem;
    }
  }

  .event-link {
    margin: 1.5rem 0 0;
    padding: 0.625rem 0;
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: #111827;
    font-size: 1rem;
    font-weight: 500;
    color: #f3f4f6;
    border-radius: 0.375rem;
    transition: all 100ms linear;

    &:hover {
      background-color: #1f2937;
      color: #fff;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: #f9fafb 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .home-link {
    margin: 2rem 0 0;
    display: inline-flex;
    text-decoration: underline;
    color: #111827;
    transition: color 100ms linear;

    &:hover {
      color: #000;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      color: #1d4ed8;
    }
  }

  @media (max-width: 640px) {
    padding: 2.5rem 1.5rem 4rem;

    .flex-row {
      flex-direction: column;
    }
  }

  @media (max-width: 375px) {
    .event {
      padding: 1.5rem 1rem;
    }
  }
`;
