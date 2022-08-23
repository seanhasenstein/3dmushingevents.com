import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import format from 'date-fns/format';
import { getUrlParam } from '../../../utils/misc';
import useEventQuery from '../../../hooks/useEventQuery';
import Layout from '../../../components/Layout';
import FallEventDetails from '../../../components/FallEventDetails';
import WinterEventDetails from '../../../components/WinterEventDetails';
import EventRaces from '../../../components/EventRaces';

export default function Event() {
  const router = useRouter();
  const [navOpen, setNavOpen] = React.useState(false);
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

  // disable scroll when mobile nav is open
  React.useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'inherit';
    };
  }, [navOpen]);

  return (
    <Layout
      title={query.isLoading ? 'Loading...' : query.data ? query.data.name : ''}
    >
      <EventStyles>
        {query.isError ? 'TODO: add error handling...' : null}
        {query.data ? (
          <div className="page-container">
            <div className="actions-row">
              <Link href="/">
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
                  Back to homepage
                </a>
              </Link>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setNavOpen(!navOpen);
                }}
                className="mobile-nav-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
            <div className="header">
              <img
                src={`../../${query.data.tag}-logo.png`}
                alt={`${query.data.name} logo`}
                className="logo"
              />
              <h2>{query.data.name}</h2>
              <p className="dates">
                {format(new Date(query.data.dates[0]), 'EEEE M/d, yyyy')} -{' '}
                {format(
                  new Date(query.data.dates[query.data.dates.length - 1]),
                  'EEEE M/d, yyyy'
                )}
              </p>
            </div>

            <div className={navOpen ? 'nav-open' : ''} aria-hidden="true" />
            <div className={`nav${navOpen ? ' open' : ''}`}>
              <div className="mobile-nav-header">
                <img
                  src={`../${query.data.tag}-logo.png`}
                  alt={query.data.name}
                  className="event-logo"
                />
                <h3>{query.data.name}</h3>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setNavOpen(false);
                  }}
                  className="close-nav-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close Navigation</span>
                </button>
              </div>
              <nav>
                <Link href={`/event/${query.data.tag}/register`}>
                  <a>Register now</a>
                </Link>
                <Link href="/contact">
                  <a>Contact us</a>
                </Link>
                <a
                  href={query.data.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook page
                </a>
                <Link href="/">
                  <a className="small-screens-only">3dmushingevents.com</a>
                </Link>
              </nav>
            </div>

            <div className="main-content">
              {/* full row */}
              <div className="event-grid">
                {/* column-1 */}
                <div className="event-description">
                  <h3>Event details</h3>
                  {query.data.tag === 'fall' ? (
                    <FallEventDetails />
                  ) : query.data.tag === 'winter' ? (
                    <WinterEventDetails />
                  ) : null}
                </div>
                <div className="event-races">
                  <h3>Event races</h3>
                  <div className="races-grid">
                    <EventRaces races={query.data.races} eventTag={eventTag} />
                  </div>
                </div>
                {/* column-2 */}
                <div className="event-details">
                  {/* event details info... */}
                </div>
              </div>
              {/* full row */}
              <div className="sponsors-section">
                <h3>Sponsors</h3>
                <div className="sponsors-grid">
                  {query.data.sponsors.map(sponsor => (
                    <a
                      key={sponsor.imgUrl}
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={sponsor.name}
                      className="sponsor-item"
                    >
                      <img src={sponsor.imgUrl} alt={sponsor.name} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </EventStyles>
    </Layout>
  );
}

const EventStyles = styled.div`
  padding: 3rem 1.5rem 5rem;
  position: relative;

  .back-link {
    position: absolute;
    top: 3rem;
    left: 3.25rem;
    display: flex;
    align-items: center;
    font-size: 1rem;
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
      margin: 0 0.5rem 0 0;
      height: 1rem;
      width: 1rem;
      color: #9ca3af;
    }
  }

  .mobile-nav-button {
    display: none;
  }

  .page-container {
    margin: 0 auto;
    max-width: 70rem;
    width: 100%;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    width: 5.5rem;
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

  h3 {
    font-size: 1.25rem;
    color: #111827;
  }

  p {
    margin: 1.125rem 0 0;
    font-size: 1rem;
    color: #374151;
    line-height: 1.5;

    &.note {
      margin: 1.25rem 0 0;
      display: flex;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;

      svg {
        flex-shrink: 0;
        margin: 0.1875rem 0 0;
        height: 1rem;
        width: 1rem;
        color: #9ca3af;
      }
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

  .nav {
    margin: 2.5rem 0 0;

    .mobile-nav-header {
      display: none;
    }

    nav {
      display: flex;
      justify-content: center;
      gap: 4.5rem;
      text-align: center;
      border-top: 1px solid #c6cbd2;
      border-bottom: 1px solid #c6cbd2;
    }

    a {
      margin: 0 0 -1px;
      padding: 1rem 0;
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
      border-bottom: 3px solid transparent;
      transition: all 100ms linear;

      &.small-screens-only {
        display: none;
      }

      &:hover {
        border-color: #1d4ed8;
      }
    }
  }

  .main-content {
    margin: 4rem 0 0;
  }

  .event-grid {
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    gap: 0 6rem;
  }

  .event-description {
    .toggle-sections-container {
      margin: 2rem 0;
    }

    .toggle-section {
      border-bottom: 1px solid #dadde2;
    }

    .toggle-button {
      margin: -1px 0 0;
      padding: 1rem 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      background-color: transparent;
      border-width: 1px 0 0 0;
      border-style: solid;
      border-color: #dadde2;
      cursor: pointer;

      svg {
        height: 0.875rem;
        width: 0.875rem;
        color: #6b7280;
        transition: color 150ms linear;
      }

      &:hover {
        svg {
          color: #111827;
        }
      }
    }

    .toggle-body {
      display: none;

      &.open {
        margin: 0 0 2rem;
        display: block;

        p:first-child {
          margin: 0.5rem 0 0;
        }

        ul:first-child {
          margin: 0;
        }
      }
    }

    ul {
      margin: 0.75rem 0 0;
      padding: 0 0 0 1rem;
      list-style-type: disc;

      &.secondary {
        margin: 0.5rem 0 1.25rem;
        list-style-type: circle;
      }
    }

    li {
      margin: 0.375rem 0 0;
      color: #374151;
      line-height: 1.5;
    }

    .bold {
      font-weight: 600;
      color: #111827;
    }

    a {
      text-decoration: underline;
      transition: all 100ms linear;

      &:hover {
        color: #1d4ed8;
      }
    }
  }

  .sponsors-section {
    margin: 4rem 0 0;
  }

  .sponsors-grid {
    margin: 1.5rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 1rem;

    .sponsor-item {
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.125rem;
      border: 1px solid #dadde2;
      background-color: #fff;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05),
        0 2px 4px -2px rgb(0 0 0 / 0.05);
      transition: all 100ms linear;

      img {
        width: 100%;
      }

      &:hover {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.075),
          0 4px 6px -4px rgb(0 0 0 / 0.075);
      }
    }
  }

  @media (max-width: 1024px) {
    .event-grid {
      gap: 0 4rem;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin: 3.5rem 0 0;
    }

    .nav {
      nav {
        gap: 2rem;
        justify-content: space-between;
      }
    }

    .event-grid {
      grid-template-columns: 1fr;
      gap: 4rem 0;
    }

    .sponsors-section {
      margin: 0;
    }
  }

  @media (max-width: 640px) {
    padding: 0 1.5rem 5rem;

    .actions-row {
      padding: 1.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dadde2;
    }

    .header {
      margin: 1.5rem 0 0;
    }

    .nav-open {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.8);
    }

    .back-link {
      padding: 0.25rem 0;
      position: static;
    }

    .mobile-nav-button {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;

      svg {
        flex-shrink: 0;
        height: 1.5rem;
        width: 1.5rem;
      }
    }

    .nav {
      margin: 0;
      display: none;
      flex-direction: column;
      position: absolute;
      top: 1rem;
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      width: calc(100% - 2rem);
      height: calc(100vh - 2rem);
      background-color: #fff;
      border-radius: 0.375rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);

      &.open {
        display: flex;
      }

      .mobile-nav-header {
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .event-logo {
          width: 4.5rem;

          img {
            width: 100%;
          }
        }

        h3 {
          margin: 1rem 0 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          text-align: center;
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

          svg {
            flex-shrink: 0;
            height: 1.5rem;
            width: 1.5rem;
          }
        }
      }

      nav {
        margin: 0 auto;
        max-width: 75%;
        width: 100%;
        flex-direction: column;
        justify-content: flex-start;
        gap: 0;
        border-color: #dadde2;

        a,
        a:hover {
          border-bottom: 1px solid #dadde2;

          &.small-screens-only {
            display: block;
          }
        }
      }
    }
  }

  @media (max-width: 375px) {
    .dates {
      font-size: 0.5625rem;
    }
  }

  @media (max-width: 350px) {
    .nav .mobile-nav-header .close-nav-button {
      top: 1rem;
      right: 1rem;
      border-radius: 0.375rem;
      height: 2.5rem;
      width: 2.5rem;
    }
  }
`;
