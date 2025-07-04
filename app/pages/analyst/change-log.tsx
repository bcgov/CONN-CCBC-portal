import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { useFeature } from '@growthbook/growthbook-react';
import { graphql } from 'react-relay';
import { DashboardTabs, TableTabs } from 'components/AnalystDashboard';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import ProjectChangeLog from 'components/AnalystDashboard/ProjectChangeLog';
import { changeLogQuery } from '__generated__/changeLogQuery.graphql';
import { ProjectChangeLog_cbcs$key } from '__generated__/ProjectChangeLog_cbcs.graphql';
import { ProjectChangeLog_applications$key } from '__generated__/ProjectChangeLog_applications.graphql';


const getChangeLogQuery = graphql`
  query changeLogQuery (
    $cbcCount: Int!
    $cbcCursor: Cursor
    $appCount: Int!
    $appCursor: Cursor
  ) {
    session {
      sub
      authRole
      ...DashboardTabs_query
    }
    ...ProjectChangeLog_cbcs @arguments(count: $cbcCount, cursor: $cbcCursor)
    ...ProjectChangeLog_applications @arguments(count: $appCount, cursor: $appCursor)
  }
`;

const StyledDashboardContainer = styled.div`
  width: 100%;
`;

const ChangeLog = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, changeLogQuery>) => {
  const query = usePreloadedQuery(getChangeLogQuery, preloadedQuery);
  const { session } = query;
  const isMaxWidthOverride = useFeature('max_width_override').value;
  const showChangeLogTab = useFeature('show_project_change_log_table').value;

  if (!showChangeLogTab) return null;

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      maxWidthOverride={isMaxWidthOverride && '1600px'}
    >
      <StyledDashboardContainer>
        <DashboardTabs session={session} />
        <TableTabs />
        <ProjectChangeLog
            cbcsQuery={query as ProjectChangeLog_cbcs$key}
            appsQuery={query as ProjectChangeLog_applications$key}
        />
      </StyledDashboardContainer>
    </Layout>
  );
};

export default withRelay(ChangeLog, getChangeLogQuery, {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => {
    const variables = defaultRelayOptions.variablesFromContext(ctx);
    return {
      ...variables,
      cbcCount: 10,
      cbcCursor: null,
      appCount: 10,
      appCursor: null,
    };
  },
});
