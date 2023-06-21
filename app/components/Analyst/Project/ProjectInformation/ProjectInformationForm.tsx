import { useCallback, useMemo, useRef, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import ProjectForm from 'components/Analyst/Project/ProjectForm';
import projectInformationSchema from 'formSchema/analyst/projectInformation';
import projectInformationReadOnlySchema from 'formSchema/analyst/projectInformationReadOnly';
import projectInformationUiSchema from 'formSchema/uiSchema/analyst/projectInformationUiSchema';
import projectInformationReadOnlyUiSchema from 'formSchema/uiSchema/analyst/projectInformationReadOnlyUiSchema';
import { useCreateProjectInformationMutation } from 'schema/mutations/project/createProjectInformation';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';
import MetabaseLink from 'components/Analyst/Project/ProjectInformation/MetabaseLink';
import Toast from 'components/Toast';
import validateFormData from '@rjsf/core/dist/cjs/validate';
import { Alert } from '@button-inc/bcgov-theme';

const StyledAlert = styled(Alert)`
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const displaySowUploadErrors = (err) => {
  const { level: errorType, error: errorMessage } = err;
  let title =
    'An unknown error has occured while validating the Statement of Work data';
  if (errorType?.includes('tab')) {
    title = `There was an error importing the Statement of Work data at ${errorType}`;
  }
  if (errorType === 'summary') {
    title =
      'There was an error importing the Statement of Work data at the Summary tab';
  }

  if (errorType === 'database') {
    title = 'An error occured when validating the Statement of Work data';
  }

  if (errorType === 'workbook') {
    title =
      'The Statement of Work sheet does not appear to contain the correct tabs.';
  }
  // for cell level errors
  if (typeof errorMessage !== 'string') {
    return errorMessage.map(({ error: message }) => {
      return (
        <StyledAlert
          key={message}
          variant="danger"
          closable={false}
          content={
            <>
              <div> {title}</div>
              <div>{message}</div>
            </>
          }
        />
      );
    });
  }
  return (
    <StyledAlert
      key={errorMessage}
      variant="danger"
      closable={false}
      content={
        <>
          <div> {title}</div>
          <p>{errorMessage}</p>
        </>
      }
    />
  );
};

const StyledProjectForm = styled(ProjectForm)`
  .datepicker-widget {
    max-width: 200px;
  }
`;

const ProjectInformationForm = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ProjectInformationForm_application on Application {
        id
        rowId
        ccbcNumber
        projectInformation {
          id
          jsonData
        }
      }
    `,
    application
  );

  const { ccbcNumber, id, rowId, projectInformation } = queryFragment;

  const [createProjectInformation] = useCreateProjectInformationMutation();
  const [formData, setFormData] = useState(projectInformation?.jsonData);
  const [showToast, setShowToast] = useState(false);
  const [sowValidationErrors, setSowValidationErrors] = useState([]);
  const [isFormEditMode, setIsFormEditMode] = useState(
    !projectInformation?.jsonData
  );
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  const hasFormErrors = useMemo(() => {
    if (formData === null) {
      return false;
    }
    const formErrors = validateFormData(
      formData,
      projectInformationSchema
    )?.errors;

    // not sure about these enum or oneOf errors, filtering them out as a very hacky solution
    const filteredErrors = formErrors?.filter((error) => {
      return (
        error.message !== 'should be string' &&
        error.name !== 'enum' &&
        error.name !== 'oneOf'
      );
    });

    const isFormValid = filteredErrors.length <= 0;
    return !isFormValid;
  }, [formData]);

  const validateSow = useCallback(
    async (file) => {
      const sowFileFormData = new FormData();
      sowFileFormData.append('file', file);

      const response = await fetch(`/api/analyst/sow/${rowId}/${ccbcNumber}`, {
        method: 'POST',
        body: sowFileFormData,
      });

      const sowErrorList = await response.json();
      if (Array.isArray(sowErrorList) && sowErrorList.length > 0) {
        setSowValidationErrors(sowErrorList);
      } else {
        setSowValidationErrors([]);
      }
      return response;
    },
    [setSowValidationErrors, ccbcNumber, rowId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    hiddenSubmitRef.current.click();

    if (hasFormErrors) {
      return;
    }

    createProjectInformation({
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
            store.get(data.createProjectInformation.projectInformationData.id),
            'projectInformation'
          );
      },
    });
  };

  const handleResetFormData = () => {
    setFormData(projectInformation?.jsonData || {});
    setShowToast(false);
  };

  return (
    <StyledProjectForm
      additionalContext={{
        applicationId: rowId,
        ccbcNumber,
        validateSow,
      }}
      formData={formData}
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      isFormEditMode={isFormEditMode}
      title="Project information"
      schema={
        isFormEditMode
          ? projectInformationSchema
          : projectInformationReadOnlySchema
      }
      theme={ProjectTheme}
      uiSchema={
        isFormEditMode
          ? projectInformationUiSchema
          : projectInformationReadOnlyUiSchema
      }
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      saveBtnText="Save & Import Data"
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      hiddenSubmitRef={hiddenSubmitRef}
    >
      {!isFormEditMode && <MetabaseLink />}
      {showToast && (
        <Toast timeout={100000000}>
          Statement of work successfully imported
        </Toast>
      )}
      {sowValidationErrors?.length > 0 &&
        sowValidationErrors.flatMap(displaySowUploadErrors)}
    </StyledProjectForm>
  );
};

export default ProjectInformationForm;
