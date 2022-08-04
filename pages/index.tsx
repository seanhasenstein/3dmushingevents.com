import styled from 'styled-components';

export default function Home() {
  return (
    <HomepageStyles>
      <h1>This will be the homepage...</h1>
    </HomepageStyles>
  );
}

const HomepageStyles = styled.div`
  padding: 2rem;

  h1 {
    font-size: 1.5rem;
  }
`;
