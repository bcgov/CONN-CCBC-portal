import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { AnalystTable, DashboardTabs } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { applicationIntakesQuery } from '__generated__/applicationIntakesQuery.graphql';

const getApplicationIntakesQuery = graphql`
  query applicationIntakesQuery {
    session {
      sub
      ...DashboardTabs_query
    }
    ...AnalystTable_query
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const ApplicationIntakes = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, applicationIntakesQuery>) => {
  const query = usePreloadedQuery(getApplicationIntakesQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AnalystTable query={query} />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ApplicationIntakes,
  getApplicationIntakesQuery,
  defaultRelayOptions
);
