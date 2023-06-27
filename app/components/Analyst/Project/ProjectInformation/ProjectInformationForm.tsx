import { useMemo, useRef, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import ProjectForm from 'components/Analyst/Project/ProjectForm';
import projectInformationSchema from 'formSchema/analyst/projectInformation';
import projectInformationReadOnlySchema from 'formSchema/analyst/projectInformationReadOnly';
import projectInformationUiSchema from 'formSchema/uiSchema/analyst/projectInformationUiSchema';
import projectInformationReadOnlyUiSchema from 'formSchema/uiSchema/analyst/projectInformationReadOnlyUiSchema';
import { useCreateProjectInformationMutation } from 'schema/mutations/project/createProjectInformation';
import { useArchiveApplicationSowMutation } from 'schema/mutations/project/archiveApplicationSow';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';
import MetabaseLink from 'components/Analyst/Project/ProjectInformation/MetabaseLink';
import Toast from 'components/Toast';
import validateFormData from '@rjsf/core/dist/cjs/validate';

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
  const [archiveApplicationSow] = useArchiveApplicationSowMutation();
  const [formData, setFormData] = useState(projectInformation?.jsonData);
  const [showToast, setShowToast] = useState(false);
  const [sowFile, setSowFile] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    hiddenSubmitRef.current.click();
    if (hasFormErrors) {
      return;
    }
    if (!formData.hasFundingAgreementBeenSigned) {
      // archive by application id
      archiveApplicationSow({
        variables: {
          input: { _amendmentNumber: 0 },
        },
      });
    }
    validateSow(sowFile, false).then(() => {
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
              store.get(
                data.createProjectInformation.projectInformationData.id
              ),
              'projectInformation'
            );
        },
      });
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
        rowId,
      }}
      formData={formData}
      handleChange={(e) => {
        if (!e.formData.hasFundingAgreementBeenSigned) {
          setFormData({ ...e.formData, main: {} });
        } else {
          setFormData({ ...e.formData });
        }
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
      {!isFormEditMode && (
        <MetabaseLink
          href="#"
          text="View project data in Metabase"
          width={326}
        />
      )}
      {showToast && (
        <Toast timeout={100000000}>
          Statement of work successfully imported
        </Toast>
      )}
    </StyledProjectForm>
  );
};

export default ProjectInformationForm;
