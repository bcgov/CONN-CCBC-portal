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
import screeningUiSchema from 'formSchema/uiSchema/analyst/screeningUi';

// replace with slug later with tabs
const getScreeningAssessmentQuery = graphql`
  query screeningAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_slug: "screeningAssessmentSchema") {
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

  const {
    applicationByRowId: {
      assessmentForm: { jsonData },
    },
    session,
  } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          formData={jsonData}
          schema={screening}
          uiSchema={screeningUiSchema}
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
