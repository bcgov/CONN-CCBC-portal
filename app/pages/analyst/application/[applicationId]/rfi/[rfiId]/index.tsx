import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { AnalystLayout } from 'components/Analyst';
import RfiForm from 'components/Analyst/RFI/RfiForm';
import { RfiIdQuery } from '__generated__/RfiIdQuery.graphql';
import GuideLink from 'components/Analyst/GuideLink';

const getRfiIdQuery = graphql`
  query RfiIdQuery($rowId: Int!, $rfiId: Int!) {
    rfiDataByRowId(rowId: $rfiId) {
      ...RfiForm_RfiData
    }
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const RfiId = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, RfiIdQuery>) => {
  const query = usePreloadedQuery(getRfiIdQuery, preloadedQuery);
  const { session, rfiDataByRowId } = query;
  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <h2>RFI</h2>
        <hr />
        <GuideLink />
        <RfiForm rfiDataKey={rfiDataByRowId} />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
      rfiId: parseInt(ctx.query.rfiId.toString(), 10),
    };
  },
};

export default withRelay(RfiId, getRfiIdQuery, withRelayOptions);
