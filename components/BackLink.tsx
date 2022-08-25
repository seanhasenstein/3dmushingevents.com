import Link from 'next/link';
import styled from 'styled-components';

type Props = {
  href: string;
  label: string;
};

export default function BackLink(props: Props) {
  return (
    <Link href={props.href} passHref>
      <BackLinkStyles>
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
        {props.label}
      </BackLinkStyles>
    </Link>
  );
}

const BackLinkStyles = styled.a`
  position: absolute;
  top: 2.5rem;
  left: 2.75rem;
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

  @media (max-width: 640px) {
    padding: 0.25rem 0;
    position: static;
  }
`;
