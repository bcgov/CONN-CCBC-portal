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
import technical from 'formSchema/analyst/technical';
import { technicalAssessmentQuery } from '__generated__/technicalAssessmentQuery.graphql';

const getTechnicalAssessmentQuery = graphql`
  query technicalAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_slug: "technicalAssessmentSchema") {
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

const TechnicalAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, technicalAssessmentQuery>) => {
  const query = usePreloadedQuery(getTechnicalAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={technical}
          slug="financialRiskAssessmentSchema"
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

export default withRelay(
  TechnicalAssessment,
  getTechnicalAssessmentQuery,
  withRelayOptions
);
