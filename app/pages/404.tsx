import React from 'react';
import Link from 'next/link';
import Layout from 'components/Layout';

const Error404 = () => {
  return (
    <Layout session={{}} title="Connecting Communities BC">
      <section>
        <h1>404 - the requested resource cannot be found.</h1>
        <p>Please check the request and try again or</p>
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
