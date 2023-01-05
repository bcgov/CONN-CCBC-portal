import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import {
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import projectManagement from 'formSchema/analyst/projectManagement';
import { projectManagementAssessmentQuery } from '__generated__/projectManagementAssessmentQuery.graphql';

const getPmAssessmentQuery = graphql`
  query projectManagementAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_slug: "projectManagementAssessmentSchema") {
        jsonData
      }
    }
    session {
      sub
    }
    ...AnalystSelectWidget_query
    ...AnalystLayout_query
  }
`;

const PmAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, projectManagementAssessmentQuery>) => {
  const query = usePreloadedQuery(getPmAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={projectManagement}
          slug="projectManagementAssessmentSchema"
          query={query}
        />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(PmAssessment, getPmAssessmentQuery, withRelayOptions);
