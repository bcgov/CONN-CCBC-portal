import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { DashboardTabs } from 'components/AnalystDashboard';
import { AdminTabs, FeatureFlagList } from 'components/Admin';
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
    allFeatureFlags(first: 999, orderBy: FLAG_KEY_ASC) {
      edges {
        node {
          id
          flagKey
          isEnabled
          value
          description
        }
      }
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
  const { session, allFeatureFlags } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <div>
          <h2>Feature Flags</h2>
          <p>Internally-managed feature flags.</p>
          <FeatureFlagList
            featureFlags={allFeatureFlags.edges.map((edge) => edge.node)}
          />
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
