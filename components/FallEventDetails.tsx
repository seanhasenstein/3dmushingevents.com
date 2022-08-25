import React from 'react';

export default function FallEventDetails() {
  const [distancesOpen, setDistancesOpen] = React.useState(false);
  const [classInfoOpen, setClassInfoOpen] = React.useState(false);
  const [purseOpen, setPurseOpen] = React.useState(false);

  return (
    <>
      <p>
        Doty's Dusty Dog is a family friendly environment for mushers, pups and
        spectators.
      </p>
      <p>
        Participants have the option to enter one or more of the following
        events: Canicross/Scooter/Bikejor/Rig (cart).
      </p>
      <p>
        Each person registering will be charged a trail fee of $14.00 (e.g., if
        you register for 3 events you should only have one trail fee).
      </p>

      <div className="toggle-sections-container">
        <div className="toggle-section">
          <button
            type="button"
            onClick={() => setDistancesOpen(!distancesOpen)}
            className="toggle-button"
          >
            Trail distances per class
            {distancesOpen ? (
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
          <div className={`toggle-body${distancesOpen ? ' open' : ''}`}>
            <ul>
              <li>All Rig Classes - 3.6 mile trail</li>
              <li>All Adult Scooter Classes - 2.8 mile trail</li>
              <li>All Adult Bikejor Classes - 2.8 mile trail</li>
              <li>All Adult Canicross Classes - 2.8 mile trail</li>
              <li>All Junior Classes - 1.4 mile trail</li>
            </ul>
            <p className="note">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              In the event of warm weather trail distances will be shortened.
            </p>
          </div>
        </div>

        <div className="toggle-section">
          <button
            type="button"
            onClick={() => setClassInfoOpen(!classInfoOpen)}
            className="toggle-button"
          >
            Class information
            {classInfoOpen ? (
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
          <div className={`toggle-body${classInfoOpen ? ' open' : ''}`}>
            <p>
              <span className="bold">Pro Class - All Breed</span> is a
              competitive professional class. Mushers at a minimum should know
              mushing commands, signage colors with meaning as well as trail
              passing rules and basic trail educate. Dogs should also know their
              commands.
            </p>
            <p>
              <span className="bold">Pro Class - Registered Breed</span> is a
              competitive professional class. The dogs are required to meet the
              RB standards set by ISDRA / IFSS. All dogs competing in this class
              are required to have proof (i.e., registration certificate).
              Mushers at a minimum should know mushing commands, signage colors
              with meaning as well as trail passing rules and basic trail
              educate. Dogs should also know their commands.
            </p>
            <p>
              <span className="bold">Sport Class</span> - AKA the sportsman
              class is designed for the new musher and/or the recreational
              musher who want to participate without the pressure from the pro
              class.{' '}
            </p>
          </div>
        </div>

        <div className="toggle-section">
          <button
            type="button"
            onClick={() => setPurseOpen(!purseOpen)}
            className="toggle-button"
          >
            Purse breakdown
            {purseOpen ? (
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
          <div className={`toggle-body${purseOpen ? ' open' : ''}`}>
            <ul>
              <li>
                <span className="bold">90% Pro Class - All Breed</span> - Equal
                payout for all groupings (e.g., 1st place 8 dog rig pays out the
                same as 1st place canicross) Grouping payouts are:
                <ul className="secondary">
                  <li>1st Place - 50%</li>
                  <li>2nd Place - 35%</li>
                  <li>3rd Place - 15%</li>
                </ul>
              </li>
              <li>
                <span className="bold">10% Pro Class - Registered Breed</span> -
                Equal payout for all groupings with RB participation. Grouping
                payouts are:
                <ul className="secondary">
                  <li>1st Place - 50%</li>
                  <li>2nd Place - 35%</li>
                  <li>3rd Place - 15%</li>
                </ul>
              </li>
              <li>
                <span className="bold">Sport Class and Junior Class</span> are
                eligible for awards / trophies / giveaways depending on
                placement. (No cash payout unless provided by a sponsor
                donation) Awards provided by grouping in 1st - 3rd placement.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p>
        Our event will adhere to IFSS and ISDRA rules including brake checks
        prior to racing and registered breed classification. RB teams will be
        required to have registration certificates for competing dogs.{' '}
      </p>
      <p>
        Location:{' '}
        <a
          href="https://goo.gl/maps/RV3LmhqaTA7xiZJG9"
          target="_blank"
          rel="noreferrer"
        >
          14504 County Road T, Mountain WI, 54149
        </a>
      </p>
    </>
  );
}
