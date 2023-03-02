import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import HistoryTable from 'components/Analyst/History/HistoryTable';
import { historyQuery } from '__generated__/historyQuery.graphql';

const getHistoryQuery = graphql`
  query historyQuery($rowId: Int!) {
    session {
      sub
    }
    ...HistoryTable_query
    ...AnalystLayout_query
  }
`;

const History = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, historyQuery>) => {
  const query = usePreloadedQuery(getHistoryQuery, preloadedQuery);
  const { session } = query;
  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <h2>History</h2>
        <HistoryTable query={query} />
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
