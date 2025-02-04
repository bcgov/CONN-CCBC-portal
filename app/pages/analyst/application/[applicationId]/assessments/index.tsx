import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { AnalystLayout } from 'components/Analyst';
import AssessmentsTable from 'components/Analyst/Assessments/AssessmentsTable';
import { assessmentsQuery } from '__generated__/assessmentsQuery.graphql';
import GuideLink from 'components/Analyst/GuideLink';

// replace with slug later with tabs
const getAssessmentsQuery = graphql`
  query assessmentsQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsTable_query
    }
    session {
      sub
    }
    ...AnalystSelectWidget_query
    ...AnalystLayout_query
  }
`;

const Assessments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, assessmentsQuery>) => {
  const query = usePreloadedQuery(getAssessmentsQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      provisionRightNav
    >
      <AnalystLayout query={query}>
        <h2>Assessments</h2>
        <hr />
        <GuideLink />
        <AssessmentsTable query={applicationByRowId} />
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

export default withRelay(Assessments, getAssessmentsQuery, withRelayOptions);
