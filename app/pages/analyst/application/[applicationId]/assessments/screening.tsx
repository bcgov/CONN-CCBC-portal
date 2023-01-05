import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { screeningAssessmentQuery } from '__generated__/screeningAssessmentQuery.graphql';
import {
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import screening from 'formSchema/analyst/screening';

// replace with slug later with tabs
const getScreeningAssessmentQuery = graphql`
  query screeningAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      id
      rowId
      assessmentForm(_assessmentDataType: "screening") {
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

const ScreeningAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, screeningAssessmentQuery>) => {
  const query = usePreloadedQuery(getScreeningAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={screening}
          slug="screeningAssessmentSchema"
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
  ScreeningAssessment,
  getScreeningAssessmentQuery,
  withRelayOptions
);
