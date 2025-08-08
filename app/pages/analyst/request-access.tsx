import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import Alert from '@button-inc/bcgov-theme/Alert';
import defaultRelayOptions from '../../lib/relay/withRelayOptions';
import { Layout } from '../../components';
import { requestAccessQuery } from '../../__generated__/requestAccessQuery.graphql';

const getRequestAccessQuery = graphql`
  query requestAccessQuery {
    session {
      sub
    }
  }
`;

const RequestAccess = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, requestAccessQuery>) => {
  const { session } = usePreloadedQuery(getRequestAccessQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <h1>CCBC Analyst login</h1>

        <section>
          <Alert size="small" variant="danger">
            You do not have access to the CCBC portal. If you need access,
            please contact your administrator.
          </Alert>
        </section>
      </div>
    </Layout>
  );
};

export default withRelay(
  RequestAccess,
  getRequestAccessQuery,
  defaultRelayOptions
);
