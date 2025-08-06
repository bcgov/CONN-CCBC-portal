import styled from 'styled-components';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { useFeature } from '@growthbook/growthbook-react';
import {
  AssessmentAssignmentTable,
  DashboardTabs,
  TableTabs,
} from 'components/AnalystDashboard';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { assessmentsTableQuery } from '__generated__/assessmentsTableQuery.graphql';

const getAssessmentsTableQuery = graphql`
  query assessmentsTableQuery {
    ...AssessmentAssignmentTable_query
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const Assessments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, assessmentsTableQuery>) => {
  const query = usePreloadedQuery(getAssessmentsTableQuery, preloadedQuery);
  const { session } = query;

  const showTable = useFeature('show_assessment_assignment_table').value;
  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      maxWidthOverride="1600px"
    >
      <StyledContainer>
        <DashboardTabs session={session} />
        {showTable && (
          <>
            <TableTabs />
            <AssessmentAssignmentTable query={query} />
          </>
        )}
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(Assessments, getAssessmentsTableQuery, {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => {
    return defaultRelayOptions.variablesFromContext(ctx);
  },
});
