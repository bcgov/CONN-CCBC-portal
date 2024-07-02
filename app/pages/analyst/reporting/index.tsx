import { Layout } from 'components';
import { DashboardTabs } from 'components/AnalystDashboard';
import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { reportingTabQuery } from '__generated__/reportingTabQuery.graphql';
import Tabs from 'components/Reporting/Tabs';

const getReportingTabQuery = graphql`
  query reportingTabQuery {
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

const ReportingTab = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, reportingTabQuery>) => {
  const query = usePreloadedQuery(getReportingTabQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <Tabs />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  ReportingTab,
  getReportingTabQuery,
  defaultRelayOptions
);
