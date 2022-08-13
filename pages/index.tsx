import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { connectToDb, event } from '../db';
import { Event } from '../interfaces';
import useEventQuery from '../hooks/useEventQuery';
import Layout from '../components/Layout';
import useEventsQuery from '../hooks/useEventsQuery';

export const getServerSideProps: GetServerSideProps = async () => {
  const db = await connectToDb();
  const events = await event.getAllEventsWithoutRegistrations(db);

  return { props: { events } };
};

type Props = {
  events: Event[];
};

export default function Home(props: Props) {
  const eventsQuery = useEventsQuery(props.events);
  useEventQuery('fall', props.events);
  useEventQuery('winter', props.events);

  return (
    <Layout>
      <HomepageStyles>
        <div className="header">
          <div>
            <h1>3D Mushing Events</h1>
            <p>Sled dog races in Northern Oconto County, Wisconsin.</p>
            <p className="note">IFSS Accredited and ISDRA Sanctioned</p>
          </div>
        </div>
        <div className="events-grid">
          {eventsQuery.data?.map(event => (
            <Link key={event._id} href={`/event/${event.tag}`}>
              <a className="event">
                <div className="featured-img">
                  <img
                    src={`./${event.tag}-1.jpg`}
                    alt="6 race dogs pulling sled on grass trail"
                  />
                </div>
                <div className="description">
                  <img
                    src={`./${event.tag}-logo.png`}
                    alt={`${event.tag} logo`}
                    className="logo"
                  />
                  <h2>{event.name}</h2>
                  <p>
                    {format(new Date(event.dates[0]), 'EEEE M/d, yyyy')} -{' '}
                    {format(
                      new Date(event.dates[event.dates.length - 1]),
                      'EEEE M/d, yyyy'
                    )}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </HomepageStyles>
    </Layout>
  );
}

const HomepageStyles = styled.div`
  .header {
    padding: 5rem 1.5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    h1 {
      font-size: 2rem;
      letter-spacing: -0.025em;
      color: #111827;
    }

    p {
      margin: 1rem 0 0;
      color: #4b5563;
      line-height: 1.5;

      &.note {
        margin: 1.5rem 0 0;
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
    }
  }

  .events-grid {
    margin: 5.5rem auto 0;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 80rem;
    width: 100%;
  }

  .event {
    position: relative;
    transition: all 100ms linear;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.35),
      0 8px 10px -6px rgb(0 0 0 / 0.35);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0),
        0 8px 10px -6px rgb(0 0 0 / 0);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      transform: translateY(-2px);
      box-shadow: #f9fafb 0px 0px 0px 3px, #2672e5 0px 0px 0px 5px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .event,
  .featured-img,
  .featured-img::after,
  .featured-img img {
    border-radius: 0.5rem;
  }

  .featured-img {
    position: relative;
    border-radius: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgb(0, 0, 0);
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.9) 90%
      );
    }

    img {
      width: 100%;
    }
  }

  .description {
    position: absolute;
    right: 1.875rem;
    left: 2rem;
    bottom: 1.875rem;
    z-index: 50;
  }

  .logo {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 4rem;
  }

  h2 {
    margin: 0.625rem 0 0;
    font-size: 1.75rem;
    letter-spacing: -0.025em;
    color: #f3f4f6;
  }

  p {
    margin: 0.625rem 0 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: #c7cbd2;
  }

  @media (max-width: 1280px) {
    .events-grid {
      gap: 2rem;
    }
  }

  @media (max-width: 1024px) {
    .events-grid {
      margin-bottom: 4rem;
      grid-template-columns: 1fr;
      gap: 2.75rem;
    }
  }

  @media (max-width: 640px) {
    .event,
    .event:hover {
      transform: translateY(0);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15),
        0 8px 10px -6px rgb(0 0 0 / 0.15);
    }

    .event:focus-visible {
      transform: translateY(0);
      box-shadow: #f9fafb 0px 0px 0px 3px, #2672e5 0px 0px 0px 5px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, 0 20px 25px -5px rgb(0 0 0 / 0.15),
        0 8px 10px -6px rgb(0 0 0 / 0.15);
    }

    .featured-img,
    .featured-img::after,
    .featured-img img {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .description {
      position: relative;
      z-index: 50;
      right: unset;
      left: unset;
      bottom: unset;
      padding: 0 1.25rem 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo {
      bottom: unset;
      right: unset;
      left: 1rem;
      top: -5.25rem;
    }

    h2 {
      margin: 1.625rem 0 0;
      font-size: 1.5rem;
      color: #111827;
      text-align: center;
    }

    p {
      font-size: 1rem;
      color: #6b7280;
      text-align: center;
    }
  }

  @media (max-width: 375px) {
    .header {
      h1 {
        font-size: 1.75rem;
        letter-spacing: -0.025em;
        color: #111827;
      }

      p.note {
        font-size: 0.625rem;
        font-weight: 700;
      }
    }
  }
`;
