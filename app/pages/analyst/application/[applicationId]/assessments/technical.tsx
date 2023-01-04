import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import AssessmentsTabs from 'components/Analyst/Assessments/AssessmentsTabs';
import { technicalAssessmentQuery } from '__generated__/technicalAssessmentQuery.graphql';

const getTechnicalAssessmentQuery = graphql`
  query technicalAssessmentQuery($rowId: Int!) {
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

  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <p>Technical assessment placeholder</p>
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
