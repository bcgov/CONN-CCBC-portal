import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { AnalystTable } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { Layout } from '../../components';
import { dashboardAnalystQuery } from '../../__generated__/dashboardAnalystQuery.graphql';
// will probably have to change to cursor for pagination/infinte scroll
const getDashboardAnalystQuery = graphql`
  query dashboardAnalystQuery {
    session {
      sub
    }
    allApplications(orderBy: CCBC_NUMBER_ASC) {
      nodes {
        id
        ...AnalystRow_application
      }
    }
  }
`;

const StyledDashboardContainer = styled('div')`
  display: block;
`;

const AnalystDashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardAnalystQuery>) => {
  const { session, allApplications } = usePreloadedQuery(
    getDashboardAnalystQuery,
    preloadedQuery
  );

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDashboardContainer>
        <h1>CCBC Analyst dashboard</h1>
        <AnalystTable applications={{ allApplications }} />
      </StyledDashboardContainer>
    </Layout>
  );
};

export default withRelay(
  AnalystDashboard,
  getDashboardAnalystQuery,
  defaultRelayOptions
);
