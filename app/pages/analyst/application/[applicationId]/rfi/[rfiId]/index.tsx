import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { AnalystLayout, RFI } from 'components/Analyst';
import { RfiIdQuery } from '__generated__/RfiIdQuery.graphql';

const getRfiIdQuery = graphql`
  query RfiIdQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AnalystLayout_application
    }
    session {
      sub
    }
    allAnalysts(orderBy: NATURAL) {
      nodes {
        rowId
        givenName
        familyName
      }
    }
  }
`;

const RfiId = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, RfiIdQuery>) => {
  const { allAnalysts, applicationByRowId, session } = usePreloadedQuery(
    getRfiIdQuery,
    preloadedQuery
  );

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout
        analysts={{ allAnalysts }}
        application={applicationByRowId}
      >
        <h2>RFI</h2>
        <hr />
        <RFI />
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
