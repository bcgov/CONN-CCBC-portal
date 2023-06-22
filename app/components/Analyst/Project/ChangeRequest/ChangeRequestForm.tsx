import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AddButton, ProjectForm } from 'components/Analyst/Project';
import changeRequestSchema from 'formSchema/analyst/changeRequest';
import changeRequestUiSchema from 'formSchema/uiSchema/analyst/changeRequestUiSchema';
import { useCreateChangeRequestMutation } from 'schema/mutations/project/createChangeRequest';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';
import Toast from 'components/Toast';
import ChangeRequestCard from './ChangeRequestCard';

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
        projectInformation {
          jsonData
        }
        changeRequestDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          orderBy: CHANGE_REQUEST_NUMBER_ASC
          first: 999
        )
          @connection(
            key: "ChangeRequestForm_changeRequestDataByApplicationId"
          ) {
          __id
          edges {
            node {
              id
              changeRequestNumber
              createdAt
              jsonData
              updatedAt
            }
          }
        }
      }
    `,
    application
  );

  const {
    ccbcNumber,
    rowId,
    changeRequestDataByApplicationId,
    projectInformation,
  } = queryFragment;

  const changeRequestData = changeRequestDataByApplicationId?.edges;
  const connectionId = changeRequestDataByApplicationId?.__id;
  const newChangeRequestNumber = changeRequestData.length + 1;
  const isOriginalSowUpload =
    projectInformation?.jsonData?.main?.upload?.statementOfWorkUpload?.[0];

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
          _changeRequestNumber: newChangeRequestNumber,
          _jsonData: formData,
        },
      },
      onCompleted: () => {
        setIsFormEditMode(false);
        setFormData({});
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
        <>
          {isOriginalSowUpload ? (
            <AddButton
              isFormEditMode={isFormEditMode}
              onClick={() => {
                setShowToast(false);
                setIsFormEditMode(true);
              }}
              title="Add change request"
            />
          ) : (
            <div>
              Change requests will be available after a funding agreement has
              been signed.
            </div>
          )}
        </>
      }
      formData={formData}
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      formAnimationHeight={200}
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
      schema={isOriginalSowUpload ? changeRequestSchema : {}}
      uiSchema={changeRequestUiSchema}
    >
      {changeRequestData?.map((changeRequest) => {
        const { id, changeRequestNumber, createdAt, jsonData, updatedAt } =
          changeRequest.node;
        const sowUpload = jsonData?.statementOfWorkUpload?.[0];
        return (
          <ChangeRequestCard
            key={id}
            changeRequestNumber={changeRequestNumber}
            fileData={sowUpload}
            date={updatedAt || createdAt}
          />
        );
      })}
      {showToast && (
        <Toast timeout={100000000}>
          Statement of work successfully imported
        </Toast>
      )}
    </StyledProjectForm>
  );
};

export default ChangeRequestForm;
