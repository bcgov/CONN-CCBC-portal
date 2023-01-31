import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { AnalystTable, DashboardTabs } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { dashboardAnalystQuery } from '__generated__/dashboardAnalystQuery.graphql';

// will probably have to change to cursor for pagination/infinte scroll
const getDashboardAnalystQuery = graphql`
  query dashboardAnalystQuery {
    session {
      sub
      ...DashboardTabs_query
    }
    ...AnalystTable_query
  }
`;

const StyledDashboardContainer = styled.div`
  width: 100%;
`;

const AnalystDashboard = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, dashboardAnalystQuery>) => {
  const query = usePreloadedQuery(getDashboardAnalystQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDashboardContainer>
        <DashboardTabs session={session} />
        <AnalystTable query={query} />
      </StyledDashboardContainer>
    </Layout>
  );
};

export default withRelay(
  AnalystDashboard,
  getDashboardAnalystQuery,
  defaultRelayOptions
);
