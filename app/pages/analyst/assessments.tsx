import styled from 'styled-components';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
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
    allApplications(
      filter: {
        status: {
          in: ["received", "screening", "assessment", "recommendation"]
        }
      }
    ) {
      edges {
        node {
          allAssessments(filter: { archivedAt: { isNull: true } }) {
            edges {
              node {
                jsonData
                assessmentDataType
                rowId
              }
            }
          }
          organizationName
          package
          status
          ccbcNumber
          rowId
          projectName
          intakeId
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
`;

const Assessments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, assessmentsTableQuery>) => {
  const query = usePreloadedQuery(getAssessmentsTableQuery, preloadedQuery);
  const { allApplications, session } = query;

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      maxWidthOverride="1600px"
    >
      <StyledContainer>
        <DashboardTabs session={session} />
        <TableTabs />
        <AssessmentAssignmentTable allApplications={allApplications} />
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
