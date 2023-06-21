import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AddButton, ProjectForm } from 'components/Analyst/Project';
import changeRequestSchema from 'formSchema/analyst/changeRequest';
import changeRequestUiSchema from 'formSchema/uiSchema/analyst/changeRequestUiSchema';
import { useCreateChangeRequestMutation } from 'schema/mutations/project/createChangeRequest';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';
import Toast from 'components/Toast';

const StyledProjectForm = styled(ProjectForm)`
  .datepicker-widget {
    max-width: 200px;
  }
`;

const ChangeRequestForm = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ChangeRequestForm_application on Application {
        id
        rowId
        ccbcNumber
        changeRequestDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          orderBy: CREATED_AT_DESC
          first: 1
        )
          @connection(
            key: "ChangeRequestForm_changeRequestDataByApplicationId"
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

  const { ccbcNumber, id, rowId, changeRequestDataByApplicationId } =
    queryFragment;

  const changeRequestData = changeRequestDataByApplicationId?.edges?.[0]?.node;

  const [createChangeRequest] = useCreateChangeRequestMutation();
  const [formData, setFormData] = useState(changeRequestData?.jsonData || {});
  const [showToast, setShowToast] = useState(false);
  const [isFormEditMode, setIsFormEditMode] = useState(
    !changeRequestData?.jsonData
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    createChangeRequest({
      variables: {
        input: { _applicationId: rowId, _jsonData: formData },
      },
      onCompleted: () => {
        setIsFormEditMode(false);

        // May need to change when the toast is shown when we add validation
        setShowToast(true);
      },
      updater: (store, data) => {
        store
          .get(id)
          .setLinkedRecord(
            store.get(data.createChangeRequest.changeRequestData.id),
            'changeRequest'
          );
      },
    });
  };

  const handleResetFormData = () => {
    setFormData({});
    setShowToast(false);
  };

  return (
    <StyledProjectForm
      additionalContext={{
        applicationId: rowId,
        ccbcNumber,
      }}
      before={
        <AddButton
          isFormEditMode={isFormEditMode}
          onClick={() => setIsFormEditMode(true)}
          title="Add change request"
        />
      }
      formData={formData}
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      isFormEditMode={isFormEditMode}
      title="Change request"
      schema={changeRequestSchema}
      theme={ProjectTheme}
      uiSchema={changeRequestUiSchema}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      saveBtnText="Save & Import Data"
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
    >
      {showToast && (
        <Toast timeout={100000000}>
          Statement of work successfully imported
        </Toast>
      )}
    </StyledProjectForm>
  );
};

export default ChangeRequestForm;
