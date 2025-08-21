import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import {
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import permitting from 'formSchema/analyst/permitting';
import { permittingAssessmentQuery } from '__generated__/permittingAssessmentQuery.graphql';
import assessmentsUiSchema from 'formSchema/uiSchema/analyst/assessmentsUiSchema';

const getPermittingAssessmentQuery = graphql`
  query permittingAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_assessmentDataType: "permitting") {
        jsonData
      }
      ccbcNumber
    }
    session {
      sub
    }
    ...AnalystSelectWidget_query
    ...AnalystLayout_query
  }
`;

const permittingUiSchema = {
  ...assessmentsUiSchema,
  decision: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      boldTitle: true,
    },
  },
};

const PermittingAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, permittingAssessmentQuery>) => {
  const query = usePreloadedQuery(getPermittingAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          addedContext={{ ccbcNumber: applicationByRowId.ccbcNumber }}
          formData={applicationByRowId.assessmentForm?.jsonData}
          uiSchema={permittingUiSchema}
          schema={permitting}
          slug="permitting"
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
  PermittingAssessment,
  getPermittingAssessmentQuery,
  withRelayOptions
);
