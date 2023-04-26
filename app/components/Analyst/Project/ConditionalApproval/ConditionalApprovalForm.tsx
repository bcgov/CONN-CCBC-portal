import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
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

const ConditionalApprovalForm = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ConditionalApprovalForm_application on Application {
        id
        rowId
        conditionalApproval {
          id
          jsonData
        }
      }
    `,
    application
  );

  const { id, rowId, conditionalApproval } = queryFragment;

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
      // clear history before opening modal to prevent bug where modal doesn't open when the anchor hash is in the url already
      window.history.replaceState(null, null, ' ');
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
      />
      <ProjectForm
        formData={newFormData}
        handleChange={(e) => {
          setNewFormData({ ...e.formData });
        }}
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
        setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      />
    </>
  );
};

export default ConditionalApprovalForm;
