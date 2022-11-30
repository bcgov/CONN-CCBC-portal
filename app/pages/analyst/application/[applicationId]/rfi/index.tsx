import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Button from '@button-inc/bcgov-theme/Button';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { rfiQuery } from '__generated__/rfiQuery.graphql';

const getRfiQuery = graphql`
  query rfiQuery($rowId: Int!) {
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

const RFI = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, rfiQuery>) => {
  const { allAnalysts, applicationByRowId, session } = usePreloadedQuery(
    getRfiQuery,
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
        <Button>Create RFI</Button>
        {/* RFI list will go here */}
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

export default withRelay(RFI, getRfiQuery, withRelayOptions);
