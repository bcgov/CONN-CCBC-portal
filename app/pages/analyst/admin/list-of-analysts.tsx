import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { DashboardTabs } from 'components/AnalystDashboard';
import { AdminTabs, AnalystList } from 'components/Admin';
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
    allAnalysts(orderBy: GIVEN_NAME_ASC) {
      nodes {
        familyName
        givenName
        active
        id
      }
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const ListOfAnalysts = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, listOfAnalystsQuery>) => {
  const query = usePreloadedQuery(getListOfAnalystsQuery, preloadedQuery);
  const { allAnalysts, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <div>
          <h2>List of Analysts</h2>
          <p>
            Deactivating an analyst will remove the name from any dropdown lists
            such as assign lead, but the name will remain visible everywhere
            they are already assigned.
          </p>
          <AnalystList analysts={allAnalysts.nodes} />
        </div>
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ListOfAnalysts,
  getListOfAnalystsQuery,
  defaultRelayOptions
);
