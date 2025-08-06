import { Layout } from 'components';
import { DashboardTabs } from 'components/AnalystDashboard';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Tabs from 'components/Reporting/Tabs';
import ManageReports from 'components/Reporting/ManageReports';
import { manageReportsQuery } from '__generated__/manageReportsQuery.graphql';

const getManageReportingQuery = graphql`
  query manageReportsQuery {
    allReportingGcpes(
      first: 9999
      condition: { archivedAt: null }
      orderBy: ID_DESC
    ) @connection(key: "ManageReporting_allReportingGcpes") {
      __id
      edges {
        node {
          __id
          id
          rowId
          createdAt
          createdBy
          ccbcUserByCreatedBy {
            id
            sessionSub
          }
        }
      }
    }
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ManageReporting = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, manageReportsQuery>) => {
  const query = usePreloadedQuery(getManageReportingQuery, preloadedQuery);
  const { allReportingGcpes, session } = query;

  const reportList =
    allReportingGcpes &&
    [...allReportingGcpes.edges].filter((data: any) => {
      return (
        data.node !== null &&
        data.node?.ccbcUserByCreatedBy.sessionSub === session?.sub
      );
    });

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <Tabs />
        <ManageReports
          reportList={reportList}
          connectionId={allReportingGcpes.__id}
        />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ManageReporting,
  getManageReportingQuery,
  defaultRelayOptions
);
