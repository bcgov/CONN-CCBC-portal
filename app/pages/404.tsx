import React from 'react';
import Link from 'next/link';
import Layout from 'components/Layout';

const Error404 = () => {
  return (
    <Layout session={{}} title="Connecting Communities BC">
      <section>
        <h1>Sorry, requested resource cannot be found...</h1>
        <p>404 - Not Found</p>
        <p>
          Return back to{' '}
          <Link href="/" passHref>
            Home
          </Link>{' '}
        </p>
      </section>
    </Layout>
  );
};

export default Error404;
