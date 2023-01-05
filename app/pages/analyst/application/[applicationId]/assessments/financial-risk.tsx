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
import financialRisk from 'formSchema/analyst/financialRisk';
import { financialRiskAssessmentQuery } from '__generated__/financialRiskAssessmentQuery.graphql';

const getFinancialRiskAssessmentQuery = graphql`
  query financialRiskAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_slug: "financialRiskAssessmentSchema") {
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

const FinancialRiskAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, financialRiskAssessmentQuery>) => {
  const query = usePreloadedQuery(
    getFinancialRiskAssessmentQuery,
    preloadedQuery
  );

  const { applicationByRowId, session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <AssessmentsForm
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={financialRisk}
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
  FinancialRiskAssessment,
  getFinancialRiskAssessmentQuery,
  withRelayOptions
);
