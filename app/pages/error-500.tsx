import React from 'react';
import Link from 'next/link';
import Layout from 'components/Layout';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery } from 'react-relay/hooks';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { error500Query } from '__generated__/error500Query.graphql';

const getError500Query = graphql`
  query error500Query {
    session {
      sub
    }
  }
`;
const Error = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, error500Query>) => {
  const query = usePreloadedQuery(getError500Query, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
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

export default withRelay(Error, getError500Query, defaultRelayOptions);
