import { useState } from 'react';
import { useFeature } from '@growthbook/growthbook-react';
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
import conditionalApprovalReadOnlyUiSchema from 'formSchema/uiSchema/analyst/conditionalApprovalReadOnlyUiSchema';
import {
  ConditionalApprovalModal,
  ConditionalApprovalReadOnlyTheme,
} from 'components/Analyst/Tracking/ConditionalApproval';
import { useCreateConditionalApprovalMutation } from 'schema/mutations/tracking/createConditionalApproval';

const getTrackingQuery = graphql`
  query trackingQuery($rowId: Int!) {
    session {
      sub
    }
    applicationByRowId(rowId: $rowId) {
      rowId
      conditionalApproval {
        id
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

  const showConditionalApproval = useFeature('show_conditional_approval').value;

  const jsonData = conditionalApproval?.jsonData;

  const [createConditionalApproval] = useCreateConditionalApprovalMutation();
  const [newFormData, setNewFormData] = useState(conditionalApproval?.jsonData);
  const [oldFormData, setOldFormData] = useState(jsonData);
  const [isFormEditMode, setIsFormEditMode] = useState(
    !conditionalApproval?.jsonData
  );

  const oldFormStatus = oldFormData?.response?.statusApplicantSees;
  const newFormStatus = newFormData?.response?.statusApplicantSees;

  const handleSubmit = (e) => {
    e.preventDefault();

    const showStatusModal = oldFormStatus !== newFormStatus;

    if (showStatusModal) {
      window.location.hash = 'conditional-approval-modal';
    } else {
      window.history.replaceState(null, null, ' ');
      createConditionalApproval({
        variables: {
          input: { _applicationId: rowId, _jsonData: newFormData },
        },
        onCompleted: () => {
          setOldFormData(newFormData);
          setIsFormEditMode(false);
        },
      });
    }
  };

  const handleResetFormData = () => {
    setNewFormData(oldFormData);
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <ConditionalApprovalModal
          rowId={rowId}
          formData={newFormData}
          newFormStatus={newFormStatus}
          oldFormStatus={oldFormStatus}
          setOldFormData={() => setOldFormData(newFormData)}
          setIsFormEditMode={() => setIsFormEditMode(false)}
          resetFormData={handleResetFormData}
        />
        {showConditionalApproval && (
          <TrackingForm
            formData={newFormData}
            handleChange={(e) => {
              setNewFormData({ ...e.formData });
            }}
            isFormEditMode={isFormEditMode}
            title="Conditional approval"
            schema={conditionalApprovalSchema}
            theme={!isFormEditMode && ConditionalApprovalReadOnlyTheme}
            uiSchema={
              isFormEditMode
                ? conditionalApprovalUiSchema
                : conditionalApprovalReadOnlyUiSchema
            }
            resetFormData={handleResetFormData}
            onSubmit={handleSubmit}
            setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
          />
        )}
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
