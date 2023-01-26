import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { DashboardTabs } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { listOfAnalystsQuery } from '__generated__/listOfAnalystsQuery.graphql';

const getListOfAnalystsQuery = graphql`
  query listOfAnalystsQuery {
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

const ListOfAnalysts = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, listOfAnalystsQuery>) => {
  const query = usePreloadedQuery(getListOfAnalystsQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ListOfAnalysts,
  getListOfAnalystsQuery,
  defaultRelayOptions
);
