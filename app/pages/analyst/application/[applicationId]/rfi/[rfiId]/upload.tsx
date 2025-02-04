import RfiAnalystUpload from 'components/Analyst/RFI/RFIAnalystUpload';
import { graphql, usePreloadedQuery } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { withRelay, RelayProps } from 'relay-nextjs';
import { uploadQuery } from '__generated__/uploadQuery.graphql';
import Layout from 'components/Layout';
import { AnalystLayout } from 'components/Analyst';

const getUploadQuery = graphql`
  query uploadQuery($rowId: Int!, $rfiId: Int!) {
    session {
      sub
    }
    ...AnalystLayout_query
    ...RFIAnalystUpload_query
  }
`;

const AnalystRfiPage = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, uploadQuery>) => {
  const query = usePreloadedQuery(getUploadQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      provisionRightNav
    >
      <AnalystLayout query={query}>
        <h2>RFI</h2>
        <hr />
        <RfiAnalystUpload query={query} />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId?.toString(), 10) || 0,
      rfiId: parseInt(ctx.query.rfiId?.toString(), 10) || 0,
    };
  },
};

export default withRelay(AnalystRfiPage, getUploadQuery, withRelayOptions);
