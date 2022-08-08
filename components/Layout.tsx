import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { GlobalStyles } from '../styles/GlobalStyles';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout(props: Props) {
  return (
    <LayoutStyles>
      <Head>
        <title>
          {`${props.title ? `${props.title} | ` : ''}3D Mushing Events`}
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      <div>
        <header />
        <main>{props.children}</main>
      </div>
      <footer>
        <p>&copy; {new Date().getFullYear()} 3D Mushing Events.</p>
      </footer>
    </LayoutStyles>
  );
}

const LayoutStyles = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  footer {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 80rem;
    width: 100%;
    text-align: center;
    font-size: 0.875rem;
    color: #798596;

    p {
      padding: 1.75rem 0;
      border-top: 1px solid #dcdfe4;
    }
  }
`;
