import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { trackingQuery } from '__generated__/trackingQuery.graphql';
import TrackingForm from 'components/Analyst/Tracking/TrackingForm';
import conditionalApproval from 'formSchema/analyst/conditionalApproval';
import conditionalApprovalUiSchema from 'formSchema/uiSchema/analyst/conditionalApprovalUiSchema';

const getTrackingQuery = graphql`
  query trackingQuery($rowId: Int!) {
    session {
      sub
    }
    ...AnalystLayout_query
  }
`;

const Tracking = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, trackingQuery>) => {
  const query = usePreloadedQuery(getTrackingQuery, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <TrackingForm
          title="Conditional approval"
          schema={conditionalApproval}
          uiSchema={conditionalApprovalUiSchema}
        />
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

export default withRelay(Tracking, getTrackingQuery, withRelayOptions);
