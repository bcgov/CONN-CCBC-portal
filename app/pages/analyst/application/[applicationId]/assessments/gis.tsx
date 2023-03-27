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
import gis from 'formSchema/analyst/gis';
import { gisAssessmentQuery } from '__generated__/gisAssessmentQuery.graphql';

const getGisAssessmentQuery = graphql`
  query gisAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_assessmentDataType: "gis") {
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

const GisAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, gisAssessmentQuery>) => {
  const query = usePreloadedQuery(getGisAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={gis}
          slug="gis"
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
  GisAssessment,
  getGisAssessmentQuery,
  withRelayOptions
);
