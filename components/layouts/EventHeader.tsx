import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';

type Props = {
  isLoading: boolean;
  eventTag: 'fall' | 'winter' | undefined;
  dates?: string[] | undefined;
  facebookUrl: string | undefined;
};

export default function EventHeader(props: Props) {
  const router = useRouter();
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <EventHeaderStyles className={navOpen ? 'open' : ''}>
      {!props.isLoading ? (
        <>
          <div className="container">
            <div className="top-row">
              <div className="logo">
                {props.eventTag === 'fall' ? (
                  <div className="event">
                    <img src="/fall-logo.png" alt="Doty's Dusty Dryland" />
                    <div>
                      <h2 className="event-name">Doty's Dusty Dryland Race</h2>
                      {props.dates ? (
                        <p className="event-dates">
                          {format(new Date(props.dates[0]), 'EEE MMM do')} -{' '}
                          {format(
                            new Date(props.dates[props.dates.length - 1]),
                            'EEE MMM do, yyyy'
                          )}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {props.eventTag === 'winter' ? (
                  <div className="event">
                    <img
                      src="/winter-logo.png"
                      alt="Doty's Dog Days of Winter"
                    />
                    <div>
                      <h2 className="event-name">Doty's Dog Days of Winter</h2>
                      {props.dates ? (
                        <p className="event-dates">
                          {format(new Date(props.dates[0]), 'EEE. MMM. do')} -{' '}
                          {format(
                            new Date(props.dates[props.dates.length - 1]),
                            'EEE. MMM. do, yyyy'
                          )}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setNavOpen(true)}
                  className="open-nav-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Show navigation</span>
                </button>
              </div>
            </div>
            <nav className={navOpen ? 'open' : ''}>
              <Link href={`/event/${props.eventTag}`}>
                <a
                  className={router.pathname === '/event/[tag]' ? 'active' : ''}
                >
                  Event home
                </a>
              </Link>
              <Link href={`/event/${props.eventTag}/register`}>
                <a
                  className={
                    router.pathname === '/event/[tag]/register' ? 'active' : ''
                  }
                >
                  Register
                </a>
              </Link>
              <a href={props.facebookUrl} target="_blank" rel="noreferrer">
                Facebook page
              </a>
              <Link href="/contact">
                <a>Contact us</a>
              </Link>
              <Link href="/">
                <a className="sm-screen-only">3D Mushing Events homepage</a>
              </Link>
            </nav>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              className="close-nav-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close navigation</span>
            </button>
          </div>
        </>
      ) : null}
    </EventHeaderStyles>
  );
}

const EventHeaderStyles = styled.header`
  padding: 0 1.5rem;
  min-height: 6rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

  .container {
    margin: 0 auto;
    padding: 1rem 0;
    max-width: 70rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo img {
    width: 4rem;
  }

  .open-nav-button,
  .close-nav-button {
    display: none;
  }

  .event {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  .event-name {
    font-size: 1.25rem;
    letter-spacing: -0.0125em;
  }

  .event-dates {
    margin: 0.1875rem 0 0;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    line-height: initial;
  }

  nav {
    display: flex;
    gap: 2.25rem;

    a {
      padding: 0.3125rem 0.625rem;
      font-size: 1.0625rem;
      font-weight: 600;
      color: #4b5563;

      &.active,
      &.active:hover {
        background-color: #dbeafe;
        color: #1e3a8a;
        border-radius: 0.25rem;
      }

      &:hover {
        color: #111827;
      }

      &.sm-screen-only {
        display: none;
      }
    }
  }

  @media (max-width: 1024px) {
    &.open {
      position: fixed;
      top: 0;
      left: 0;
      align-items: flex-start;
      width: 100%;
      height: 100vh;
      z-index: 1000;

      .open-nav-button {
        display: none;
      }

      .close-nav-button {
        position: absolute;
        bottom: 3rem;
        height: 3rem;
        width: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: 2px solid #e5e7eb;
        color: #374151;
        background-color: #f3f4f6;
        border-radius: 9999px;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        cursor: pointer;

        .icon {
          flex-shrink: 0;
          height: 1.5rem;
          width: 1.5rem;
        }
      }
    }

    .container {
      flex-direction: column;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
    }

    .open-nav-button {
      display: block;
      position: absolute;
      top: 2.25rem;
      right: 2.5rem;
      background-color: transparent;
      border: none;
      cursor: pointer;

      .icon {
        height: 1.5rem;
        width: 1.5rem;
      }
    }

    .close-nav-button {
      display: none;
    }

    nav {
      display: none;

      &.open {
        margin: 1.5rem 0 0;
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 0;
        text-align: center;
      }

      a {
        padding: 1rem 0;
        color: #111827;
        border-top: 1px solid #e5e7eb;

        &.active {
          border: 1px solid #bfdbfe;

          + a {
            border-top: none;
          }
        }

        &:last-of-type {
          border-bottom: 1px solid #e5e7eb;
        }

        &.sm-screen-only {
          display: block;
        }
      }
    }
  }

  @media (max-width: 640px) {
    padding: 0 1rem;

    &.open {
      .container {
        align-items: center;
      }
    }

    .container {
      padding: 1.5rem 0;
      align-items: flex-start;
    }

    .event {
      gap: 0.75rem;
    }

    .logo {
      img {
        width: 3rem;
      }
    }

    .event-name {
      font-size: 1.125rem;
    }

    .event-dates {
      font-size: 0.8125rem;
    }

    .open-nav-button {
      right: 1rem;
    }
  }

  @media (max-width: 375px) {
    padding: 0 0.875rem;

    .container {
      padding: 1.125rem 0 0.875rem;
      align-items: center;
    }

    .top-row {
      flex-direction: column;
      align-items: center;
    }

    .open-nav-button {
      margin: 0.75rem 0 0;
      position: static;
    }
  }
`;
