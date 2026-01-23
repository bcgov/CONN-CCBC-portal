import { useEffect, useState } from 'react';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import ProjectForm from 'components/Analyst/Project/ProjectForm';
import conditionalApprovalSchema from 'formSchema/analyst/conditionalApproval';
import conditionalApprovalUiSchema from 'formSchema/uiSchema/analyst/conditionalApprovalUiSchema';
import conditionalApprovalReadOnlyUiSchema from 'formSchema/uiSchema/analyst/conditionalApprovalReadOnlyUiSchema';
import {
  ConditionalApprovalModal,
  ConditionalApprovalTheme,
  ConditionalApprovalReadOnlyTheme,
} from 'components/Analyst/Project/ConditionalApproval';
import { useCreateConditionalApprovalMutation } from 'schema/mutations/project/createConditionalApproval';
import styled from 'styled-components';
import useModal from 'lib/helpers/useModal';

const StyledProjectForm = styled(ProjectForm)`
  margin-top: 43px;
`;

interface Props {
  application: any;
  isExpanded?: boolean;
}

const ConditionalApprovalForm: React.FC<Props> = ({
  application,
  isExpanded,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment ConditionalApprovalForm_application on Application {
        id
        rowId
        conditionalApproval {
          id
          jsonData
        }
        conditionalApprovalDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          orderBy: CREATED_AT_DESC
          first: 1
        )
          @connection(
            key: "ConditionalApprovalForm_conditionalApprovalDataByApplicationId"
          ) {
          __id
          edges {
            node {
              id
              jsonData
            }
          }
        }
      }
    `,
    application
  );

  const {
    id,
    rowId,
    conditionalApproval,
    conditionalApprovalDataByApplicationId,
  } = queryFragment;

  const relayConnectionId = conditionalApprovalDataByApplicationId?.__id;

  const [createConditionalApproval] = useCreateConditionalApprovalMutation();
  const [newFormData, setNewFormData] = useState(null);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [oldFormData, setOldFormData] = useState(conditionalApproval?.jsonData);
  const conditionalApprovalModal = useModal();

  useEffect(() => {
    setNewFormData(conditionalApproval?.jsonData);
  }, [conditionalApproval]);

  const oldFormStatus = oldFormData?.response?.statusApplicantSees;
  const newFormStatus = newFormData?.response?.statusApplicantSees;

  const handleSubmit = (e) => {
    e.preventDefault();

    const showStatusModal = oldFormStatus !== newFormStatus;

    if (showStatusModal) {
      // clear history before opening modal to prevent bug where modal doesn't open when the anchor hash is in the url already
      window.history.replaceState(null, null, ' ');
      conditionalApprovalModal.open();
    } else {
      window.history.replaceState(null, null, ' ');
      createConditionalApproval({
        variables: {
          connections: [relayConnectionId],
          input: { _applicationId: rowId, _jsonData: newFormData },
        },
        onCompleted: () => {
          setOldFormData(newFormData);
          setIsFormEditMode(false);
        },
        updater: (store, data) => {
          // Get the connection from the store
          const connection = store.get(relayConnectionId);

          // Remove the old data from the connection
          ConnectionHandler.deleteNode(connection, conditionalApproval?.id);

          store
            .get(id)
            .setLinkedRecord(
              store.get(
                data.createConditionalApproval.conditionalApprovalData.id
              ),
              'conditionalApproval'
            );
        },
      });
    }
  };

  const handleResetFormData = () => {
    setNewFormData(oldFormData);
  };

  const additionalContext = {
    letterOfApprovalDateSent:
      newFormData?.letterOfApproval?.letterOfApprovalDateSent,
    isFormEditMode,
  };

  return (
    <>
      <ConditionalApprovalModal
        applicationStoreId={id}
        rowId={rowId}
        formData={newFormData}
        newFormStatus={newFormStatus}
        oldFormStatus={oldFormStatus}
        setOldFormData={() => setOldFormData(newFormData)}
        setIsFormEditMode={() => setIsFormEditMode(false)}
        resetFormData={handleResetFormData}
        {...conditionalApprovalModal}
      />
      <StyledProjectForm
        clearFormDataOnEdit={false}
        formData={newFormData}
        handleChange={(e) => {
          setNewFormData({ ...e.formData });
        }}
        isExpanded={isExpanded}
        isFormEditMode={isFormEditMode}
        title="Conditional approval"
        schema={conditionalApprovalSchema}
        theme={
          isFormEditMode
            ? ConditionalApprovalTheme
            : ConditionalApprovalReadOnlyTheme
        }
        uiSchema={
          isFormEditMode
            ? conditionalApprovalUiSchema
            : conditionalApprovalReadOnlyUiSchema
        }
        resetFormData={handleResetFormData}
        onSubmit={handleSubmit}
        onCancelFormData={oldFormData}
        setFormData={setNewFormData}
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
        additionalContext={additionalContext}
        isFormAnimated={false}
      />
    </>
  );
};

export default ConditionalApprovalForm;
