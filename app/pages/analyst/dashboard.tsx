import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { Layout } from '../../components';
import { dashboardAnalystQuery } from '../../__generated__/dashboardAnalystQuery.graphql';

const getDashboardAnalystQuery = graphql`
  query dashboardAnalystQuery {
    session {
      sub
    }
  }
`;

const AnalystDashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardAnalystQuery>) => {
  const { session } = usePreloadedQuery(
    getDashboardAnalystQuery,
    preloadedQuery
  );

  return (
    <Layout session={session} title="Connecting Communities BC">
      <h1>CCBC Analyst dashboard</h1>
    </Layout>
  );
};

export default withRelay(
  AnalystDashboard,
  getDashboardAnalystQuery,
  defaultRelayOptions
);
