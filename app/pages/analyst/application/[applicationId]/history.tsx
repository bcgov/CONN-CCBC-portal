import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { historyQuery } from '__generated__/historyQuery.graphql';

const getHistoryQuery = graphql`
  query historyQuery {
    session {
      sub
    }
  }
`;

const History = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, historyQuery>) => {
  const { session } = usePreloadedQuery(getHistoryQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout>
        <h2>History placeholder</h2>
      </AnalystLayout>
    </Layout>
  );
};

export default withRelay(History, getHistoryQuery, defaultRelayOptions);
