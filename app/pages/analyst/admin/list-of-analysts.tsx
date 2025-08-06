import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { DashboardTabs } from 'components/AnalystDashboard';
import { AddAnalyst, AdminTabs, AnalystList } from 'components/Admin';
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
    allAnalysts(first: 1000, orderBy: GIVEN_NAME_ASC)
      @connection(key: "ListOfAnalysts_allAnalysts") {
      __id
      edges {
        node {
          familyName
          givenName
          active
          id
          email
        }
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

  // eslint-disable-next-line no-underscore-dangle
  const relayConnectionId = allAnalysts.__id;
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
          <AnalystList
            analysts={allAnalysts.edges.map((analyst) => analyst.node)}
          />
          <AddAnalyst relayConnectionId={relayConnectionId} />
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
