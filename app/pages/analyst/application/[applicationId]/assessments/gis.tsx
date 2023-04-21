import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import {
  ApplicationGisData,
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import gis from 'formSchema/analyst/gis';
import assessmentsUiSchema from 'formSchema/uiSchema/analyst/assessmentsUiSchema';
import { gisAssessmentQuery } from '__generated__/gisAssessmentQuery.graphql';

const getGisAssessmentQuery = graphql`
  query gisAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      ...ApplicationGisData_query
      assessmentForm(_assessmentDataType: "gis") {
        jsonData
        createdAt
      }
    }
    session {
      sub
    }
    ...AnalystSelectWidget_query
    ...AnalystLayout_query
  }
`;

const gisUiSchema = {
  ...assessmentsUiSchema,
  nextStep: {
    'ui:widget': 'RadioWidget',
    'ui:options': {
      boldTitle: true,
      showCreatedAt: true,
    },
  },
};

const GisAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, gisAssessmentQuery>) => {
  const query = usePreloadedQuery(getGisAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;
  const createdAt = applicationByRowId?.assessmentForm?.createdAt;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <ApplicationGisData query={query} />
        <AssessmentsForm
          addedContext={{ createdAt }}
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={gis}
          slug="gis"
          query={query}
          uiSchema={gisUiSchema}
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
