import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Race } from '../interfaces';

type Props = {
  races: Race[];
  eventTag: 'fall' | 'winter' | undefined;
};

export default function EventRaces(props: Props) {
  const [sortedRaces] = React.useState<Record<string, Race[]>>(() => {
    return props.races.reduce(
      (accumulator: Record<string, Race[]>, currentRace) => {
        accumulator[currentRace.sled] = [
          ...(accumulator[currentRace.sled] || []),
          currentRace,
        ];
        return accumulator;
      },
      {}
    );
  });
  const [openSection, setOpenSection] = React.useState<string>();

  return (
    <EventRacesStyles>
      {Object.keys(sortedRaces).map(key => (
        <div
          key={key}
          className={`sled-section${openSection === key ? ' open' : ''}`}
        >
          <button
            type="button"
            onClick={() => {
              if (key === openSection) {
                setOpenSection(undefined);
              } else {
                setOpenSection(key);
              }
            }}
            className="section-button"
          >
            {key}
            {openSection === key ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <div>
            {sortedRaces[key].map(race => (
              <div
                key={race.id}
                className={`race-row${openSection === key ? ' open' : ''}`}
              >
                <div>
                  <div className="race-name">
                    {race.category}
                    {race.breed ? ` - ${race.breed}` : null}
                  </div>
                  <div className="notes">
                    {race.notes.map((note, index) => (
                      <div key={index} className="note">
                        <span>-</span>
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
                <Link href={`/event/${props.eventTag}/register?r=${race.id}`}>
                  <a className="register-link">Register</a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </EventRacesStyles>
  );
}

const EventRacesStyles = styled.div`
  margin: 1rem 0 0 -1.5rem;

  .sled-section {
    margin: 0 1.5rem;
    border-top: 1px solid #dadde2;

    &:last-of-type {
      border-bottom: 1px solid #dadde2;
    }

    &.open {
      margin: 0 0 0.25rem;
      padding: 0.125rem 1.5rem;
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.125rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

      + div {
        border-top-color: transparent;
      }

      .section-button {
        border-bottom: 1px solid #e5e7eb;
      }

      .race-row {
        &:last-of-type {
          border-bottom: none;
        }
      }
    }
  }

  .section-button {
    padding: 1rem 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    cursor: pointer;

    svg {
      height: 0.875rem;
      width: 0.875rem;
      color: #6b7280;
    }

    &:hover svg {
      color: #111827;
    }
  }

  .race-row {
    padding: 1rem 0;
    display: none;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    border-bottom: 1px solid #e5e7eb;

    &.open {
      display: flex;
    }
  }

  .race-name {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #111827;
    letter-spacing: -0.0125em;
  }

  .note {
    margin: 0.5rem 0 0 0.125rem;
    display: flex;
    gap: 0.3125rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #4b5563;
  }

  .register-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1d4ed8;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-left: 0;

    .sled-section {
      margin: 0 0.75rem;
    }
  }
`;
