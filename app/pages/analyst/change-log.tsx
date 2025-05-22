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

const getChangeLogQuery = graphql`
  query changeLogQuery {
    session {
      sub
      ...DashboardTabs_query
    }
    ...ProjectChangeLog_query
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
  const showTableTabs = useFeature('show_assessment_assignment_table').value;
  const isMaxWidthOverride = useFeature('max_width_override').value;

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      maxWidthOverride={isMaxWidthOverride && '1600px'}
    >
      <StyledDashboardContainer>
        <DashboardTabs session={session} />
        {showTableTabs && <TableTabs />}
        <ProjectChangeLog query={query} />
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
    };
  },
});
