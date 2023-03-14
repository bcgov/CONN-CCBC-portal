import { useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { trackingQuery } from '__generated__/trackingQuery.graphql';
import TrackingForm from 'components/Analyst/Tracking/TrackingForm';
import conditionalApprovalSchema from 'formSchema/analyst/conditionalApproval';
import conditionalApprovalUiSchema from 'formSchema/uiSchema/analyst/conditionalApprovalUiSchema';
import { useCreateConditionalApprovalMutation } from 'schema/mutations/tracking/createConditionalApproval';

const getTrackingQuery = graphql`
  query trackingQuery($rowId: Int!) {
    session {
      sub
    }
    applicationByRowId(rowId: $rowId) {
      rowId
      conditionalApproval {
        jsonData
      }
    }
    ...AnalystLayout_query
  }
`;

const Tracking = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, trackingQuery>) => {
  const query = usePreloadedQuery(getTrackingQuery, preloadedQuery);
  const {
    applicationByRowId: { rowId, conditionalApproval },
    session,
  } = query;

  const [createConditionalApproval] = useCreateConditionalApprovalMutation();
  const [newFormData, setNewFormData] = useState(conditionalApproval?.jsonData);
  const [isFormEditMode, setIsFormEditMode] = useState(
    !conditionalApproval?.jsonData
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createConditionalApproval({
      variables: {
        input: { _applicationId: rowId, _jsonData: newFormData },
      },
      onCompleted: () => {
        setIsFormEditMode(false);
      },
    });
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <TrackingForm
          formData={newFormData}
          handleChange={(e) => {
            setNewFormData({ ...e.formData });
          }}
          isFormEditMode={isFormEditMode}
          title="Conditional approval"
          schema={conditionalApprovalSchema}
          uiSchema={conditionalApprovalUiSchema}
          onSubmit={handleSubmit}
          setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
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
