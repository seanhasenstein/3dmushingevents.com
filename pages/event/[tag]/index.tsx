import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getUrlParam } from '../../../utils/misc';
import useEventQuery from '../../../hooks/useEventQuery';
import Layout from '../../../components/layouts/EventLayout';
import FallEventDetails from '../../../components/FallEventDetails';
import WinterEventDetails from '../../../components/WinterEventDetails';
import EventRaces from '../../../components/EventRaces';
import LoadingSpinner from '../../../components/LoadingSpinner';
import QueryError from '../../../components/QueryError';

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

  if (query.isError) {
    return <QueryError />;
  }

  return (
    <Layout
      title={
        query.isLoading ? 'Loading...' : query.data?.name ? query.data.name : ''
      }
      isLoading={query.isLoading}
      eventTag={query.data?.tag}
      dates={query.data?.dates}
      facebookUrl={query.data?.facebookUrl}
    >
      <EventStyles>
        {query.isLoading ? <LoadingSpinner /> : null}
        {query.data ? (
          <div className="page-container">
            <div className="event-grid">
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
            </div>
            <div className="sponsors-section">
              <h3>Event sponsors</h3>
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
            <div className="images-section">
              <h3>Event photos</h3>
              <div className="images-grid">
                {query.data.tag === 'fall' ? (
                  <>
                    <div className="img-container">
                      <img src="/fall-event-1.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-2.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-3.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-4.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-5.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-6.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-7.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-8.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-9.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/fall-event-10.jpg" alt="" />
                    </div>
                  </>
                ) : null}
                {query.data.tag === 'winter' ? (
                  <>
                    <div className="img-container">
                      <img src="/winter-event-1.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-2.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-3.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-4.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-5.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-6.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-7.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-8.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-9.jpg" alt="" />
                    </div>
                    <div className="img-container">
                      <img src="/winter-event-10.jpg" alt="" />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="facebook-section">
              <h3>Event Facebook</h3>
              <p>
                Visit the{' '}
                <a
                  href={query.data.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  our Facebook page
                </a>{' '}
                for up-to-date information, a lot more event photos, etc.
              </p>
            </div>
          </div>
        ) : null}
      </EventStyles>
    </Layout>
  );
}

const EventStyles = styled.div`
  padding: 3.5rem 1.5rem 5rem;
  position: relative;

  .page-container {
    margin: 0 auto;
    max-width: 70rem;
    width: 100%;
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
        object-fit: scale-down;
        height: 6rem;
      }

      &:hover {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.075),
          0 4px 6px -4px rgb(0 0 0 / 0.075);
      }
    }
  }

  .images-section {
    margin: 4rem 0 0;
  }

  .images-grid {
    margin: 1.5rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
    gap: 1rem;
  }

  .img-container {
    display: flex;
    border: 5px solid #fff;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

    img {
      width: 100%;
    }
  }

  .facebook-section {
    margin: 4rem 0 0;

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 1024px) {
    .event-grid {
      gap: 0 4rem;
    }
  }

  @media (max-width: 768px) {
    .event-grid {
      grid-template-columns: 1fr;
      gap: 4rem 0;
    }
  }
`;
