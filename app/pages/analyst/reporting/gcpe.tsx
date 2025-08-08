import { Layout } from 'components';
import { DashboardTabs } from 'components/AnalystDashboard';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { gcpeReportingQuery } from '__generated__/gcpeReportingQuery.graphql';
import Tabs from 'components/Reporting/Tabs';
import Gcpe from 'components/Reporting/Gcpe';

const getGcpeReportingQuery = graphql`
  query gcpeReportingQuery {
    allReportingGcpes(orderBy: ID_DESC) {
      edges {
        node {
          rowId
          createdAt
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

const GcpeReporting = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, gcpeReportingQuery>) => {
  const query = usePreloadedQuery(getGcpeReportingQuery, preloadedQuery);
  const { allReportingGcpes, session } = query;
  const gcpeEdges = allReportingGcpes.edges;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <Tabs />
        <Gcpe reportList={gcpeEdges} />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  GcpeReporting,
  getGcpeReportingQuery,
  defaultRelayOptions
);
