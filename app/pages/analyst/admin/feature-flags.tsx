import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { DashboardTabs } from 'components/AnalystDashboard';
import { AdminTabs } from 'components/Admin';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { featureFlagsQuery } from '__generated__/featureFlagsQuery.graphql';

const getFeatureFlagsQuery = graphql`
  query featureFlagsQuery {
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const FeatureFlags = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, featureFlagsQuery>) => {
  const query = usePreloadedQuery(getFeatureFlagsQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <div>
          <h2>Feature Flags</h2>
          <p>Coming soon.</p>
        </div>
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  FeatureFlags,
  getFeatureFlagsQuery,
  defaultRelayOptions
);
