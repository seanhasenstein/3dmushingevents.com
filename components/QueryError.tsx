import Link from 'next/link';
import styled from 'styled-components';

export default function QueryError() {
  return (
    <QueryErrorStyles>
      <div className="error-container">
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
        <h3>Internal server error</h3>
        <p>
          Please try reloading the page. If the problem continues please{' '}
          <Link href="/contact">
            <a>contact us</a>
          </Link>
          .
        </p>
      </div>
    </QueryErrorStyles>
  );
}

const QueryErrorStyles = styled.div`
  padding: 0 1.5rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .error-container {
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
`;
