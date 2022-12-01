import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { historyQuery } from '__generated__/historyQuery.graphql';

const getHistoryQuery = graphql`
  query historyQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AnalystLayout_application
    }
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const History = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, historyQuery>) => {
  const query = usePreloadedQuery(getHistoryQuery, preloadedQuery);
  const { applicationByRowId, session } = query;
  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query} application={applicationByRowId}>
        <h2>History placeholder</h2>
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

export default withRelay(History, getHistoryQuery, withRelayOptions);
