import React from 'react';
import Link from 'next/link';
import Layout from 'components/Layout';

const Error500 = () => {
  return (
    <Layout session={{}} title="Connecting Communities BC">
      <section>
        <h1>Uh oh, something went wrong</h1>
        <p>500 Internal Server Error</p>
        <p>
          Please return{' '}
          <Link href="/" passHref>
            Home
          </Link>{' '}
          and try again. If that doesn&apos;t work, please try again later.
        </p>
      </section>
    </Layout>
  );
};

export default Error500;
