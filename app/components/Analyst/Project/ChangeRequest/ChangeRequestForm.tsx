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
          first: 999
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

  const { ccbcNumber, rowId, changeRequestDataByApplicationId } = queryFragment;

  const changeRequestData = changeRequestDataByApplicationId?.edges;

  const connectionId = changeRequestDataByApplicationId?.__id;
  const changeRequestNumber = changeRequestData.length + 1;

  const [createChangeRequest] = useCreateChangeRequestMutation();
  const [formData, setFormData] = useState({} as any);
  const [showToast, setShowToast] = useState(false);
  const [isFormEditMode, setIsFormEditMode] = useState(false);

  const isStatementOfWorkUpload = formData?.statementOfWorkUpload;

  const handleSubmit = (e) => {
    e.preventDefault();

    createChangeRequest({
      variables: {
        connections: [connectionId],
        input: {
          _applicationId: rowId,
          _changeRequestNumber: changeRequestNumber,
          _jsonData: formData,
        },
      },
      onCompleted: () => {
        setIsFormEditMode(false);

        // May need to change when the toast is shown when we add validation
        setShowToast(true);
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
      isFormAnimated
      isFormEditMode={isFormEditMode}
      onSubmit={handleSubmit}
      resetFormData={handleResetFormData}
      saveBtnDisabled={!isStatementOfWorkUpload}
      saveBtnText="Save & Import Data"
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      showEditBtn={false}
      theme={ProjectTheme}
      title="Change request"
      schema={isFormEditMode ? changeRequestSchema : {}}
      uiSchema={changeRequestUiSchema}
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
