import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import Layout from 'components/Layout';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { cbcHistoryQuery } from '__generated__/cbcHistoryQuery.graphql';

const getCbcHistoryQuery = graphql`
  query cbcHistoryQuery($rowId: Int!) {
    cbcByRowId(rowId: $rowId) {
      projectNumber
      rowId
      sharepointTimestamp
      cbcDataByCbcId(first: 500) @connection(key: "CbcData__cbcDataByCbcId") {
        edges {
          node {
            jsonData
            sharepointTimestamp
            rowId
            projectNumber
            updatedAt
            updatedBy
          }
        }
      }
    }
    session {
      sub
    }
    ...CbcAnalystLayout_query
  }
`;

const CbcHistory = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, cbcHistoryQuery>) => {
  const query = usePreloadedQuery(getCbcHistoryQuery, preloadedQuery);
  return (
    <Layout session={null} title="Connecting Communities BC">
      <CbcAnalystLayout query={query}>
        <h2 style={{ marginTop: '55px' }}>Under construction...</h2>
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
