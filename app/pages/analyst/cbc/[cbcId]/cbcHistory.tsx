import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import Layout from 'components/Layout';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { cbcHistoryQuery } from '__generated__/cbcHistoryQuery.graphql';
import CbcHistoryTable from 'components/Analyst/CBC/History/CbcHistoryTable';
import { useRouter } from 'next/router';

const getCbcHistoryQuery = graphql`
  query cbcHistoryQuery($rowId: Int!) {
    session {
      sub
    }
    ...CbcAnalystLayout_query
    ...CbcHistoryTable_query
  }
`;

const CbcHistory = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, cbcHistoryQuery>) => {
  const router = useRouter();
  const { cbcId } = router.query;
  const rowId = cbcId ? parseInt(cbcId.toString(), 10) : undefined;
  const query = usePreloadedQuery(getCbcHistoryQuery, preloadedQuery);
  return (
    <Layout session={null} title="Connecting Communities BC">
      <CbcAnalystLayout key={rowId} query={query}>
        <h2>History</h2>
        <CbcHistoryTable query={query} />
      </CbcAnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.cbcId.toString(), 10),
    };
  },
};

export default withRelay(CbcHistory, getCbcHistoryQuery, withRelayOptions);
