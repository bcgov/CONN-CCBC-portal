import { useCallback, useMemo, useRef, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import config from 'config';
import { AddButton, ProjectForm } from 'components/Analyst/Project';
import projectInformationSchema from 'formSchema/analyst/projectInformation';
import projectInformationUiSchema from 'formSchema/uiSchema/analyst/projectInformationUiSchema';
import changeRequestSchema from 'formSchema/analyst/changeRequest';
import changeRequestUiSchema from 'formSchema/uiSchema/analyst/changeRequestUiSchema';
import { useCreateProjectInformationMutation } from 'schema/mutations/project/createProjectInformation';
import { useArchiveApplicationSowMutation } from 'schema/mutations/project/archiveApplicationSow';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';
import MetabaseLink from 'components/Analyst/Project/ProjectInformation/MetabaseLink';
import Toast from 'components/Toast';
import validateFormData from '@rjsf/core/dist/cjs/validate';
import sowValidateGenerator from 'lib/helpers/sowValidate';
import ReadOnlyView from 'components/Analyst/Project/ProjectInformation/ReadOnlyView';

const StyledProjectForm = styled(ProjectForm)`
  .datepicker-widget {
    max-width: 200px;
  }
`;

interface FlexProps {
  isFormEditMode: boolean;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: ${(props) => (props.isFormEditMode ? '0px' : '8px')};
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '0px' : '80px')};
  transition: max-height 0.5s;
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
            }
          }
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
  const [sowValidationErrors, setSowValidationErrors] = useState([]);
  const [isFormEditMode, setIsFormEditMode] = useState(
    !projectInformation?.jsonData
  );
  const [isChangeRequest, setIsChangeRequest] = useState(false);
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  const validateSow = useCallback(
    sowValidateGenerator(rowId, ccbcNumber, setSowFile, setSowValidationErrors),
    [rowId, ccbcNumber, setSowFile, setSowValidationErrors]
  );

  const formSchema = isChangeRequest
    ? changeRequestSchema
    : projectInformationSchema;
  const uiSchema = isChangeRequest
    ? changeRequestUiSchema
    : projectInformationUiSchema;

  const formUploads = formData?.main?.upload;

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
    validateSow(sowFile, 0, false).then((response) => {
      createProjectInformation({
        variables: {
          input: { _applicationId: rowId, _jsonData: formData },
        },
        onCompleted: () => {
          setIsFormEditMode(false);

          // May need to change when the toast is shown when we add validation
          if (response.status === 200) {
            setShowToast(true);
          }
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

  const getMetabaseLink = () => {
    const namespace = config.get('OPENSHIFT_APP_NAMESPACE') || 'dev-local';
    if (namespace.endsWith('-prod')) {
      return `https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/86-one-pager-project-data-sow?ccbc_number=${ccbcNumber}`;
    }
    return `https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/89-sow-data-dashboard-test?ccbc_number=${ccbcNumber}`;
  };

  const isOriginalSowUpload =
    projectInformation?.jsonData?.main?.upload?.statementOfWorkUpload?.[0];
  return (
    <StyledProjectForm
      additionalContext={{
        applicationId: rowId,
        sowValidationErrors,
        validateSow,
      }}
      before={
        <StyledFlex isFormEditMode={isFormEditMode}>
          {isOriginalSowUpload && (
            <AddButton
              isFormEditMode={isFormEditMode}
              onClick={() => {
                setIsChangeRequest(true);
                setShowToast(false);
                setIsFormEditMode(true);
              }}
              title="Add change request"
            />
          )}
          <MetabaseLink
            href={getMetabaseLink()}
            text="View project data in Metabase"
            width={326}
          />
        </StyledFlex>
      }
      formData={formData}
      handleChange={(e) => {
        if (!e.formData.hasFundingAgreementBeenSigned) {
          setFormData({ ...e.formData, main: {} });
        } else {
          setFormData({ ...e.formData });
        }
      }}
      isFormEditMode={isFormEditMode}
      title="Funding agreement, statement of work, & map"
      formAnimationHeight={isChangeRequest ? 1000 : 800}
      formAnimationHeightOffset={70}
      isFormAnimated
      schema={formSchema}
      theme={ProjectTheme}
      uiSchema={uiSchema}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      saveBtnText="Save & Import Data"
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      showEditBtn={false}
      hiddenSubmitRef={hiddenSubmitRef}
    >
      <ReadOnlyView
        dateSigned={formData?.main?.dateFundingAgreementSigned}
        title="Original"
        onFormEdit={() => {
          setIsChangeRequest(false);
          setIsFormEditMode(true);
        }}
        isFormEditMode={isFormEditMode}
        fundingAgreement={formUploads?.fundingAgreementUpload?.[0]}
        map={formUploads?.finalizedMapUpload?.[0]}
        sow={formUploads?.statementOfWorkUpload?.[0]}
        wirelessSow={formUploads?.sowWirelessUpload?.[0]}
      />
      {showToast && (
        <Toast timeout={100000000}>
          Statement of work successfully imported
        </Toast>
      )}
    </StyledProjectForm>
  );
};

export default ProjectInformationForm;
