import { useCallback, useMemo, useRef, useState } from 'react';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AddButton, ProjectForm } from 'components/Analyst/Project';
import projectInformationSchema from 'formSchema/analyst/projectInformation';
import projectInformationUiSchema from 'formSchema/uiSchema/analyst/projectInformationUiSchema';
import changeRequestSchema from 'formSchema/analyst/changeRequest';
import changeRequestUiSchema from 'formSchema/uiSchema/analyst/changeRequestUiSchema';
import { useCreateProjectInformationMutation } from 'schema/mutations/project/createProjectInformation';
import { useCreateChangeRequestMutation } from 'schema/mutations/project/createChangeRequest';
import { useArchiveApplicationSowMutation } from 'schema/mutations/project/archiveApplicationSow';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';
import MetabaseLink from 'components/Analyst/Project/ProjectInformation/MetabaseLink';
import Toast from 'components/Toast';
import Ajv8Validator from '@rjsf/validator-ajv8';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import ReadOnlyView from 'components/Analyst/Project/ProjectInformation/ReadOnlyView';
import * as Sentry from '@sentry/nextjs';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import ChangeRequestTheme from '../ChangeRequestTheme';

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
  padding-bottom: ${(props) => (props.isFormEditMode ? '0px' : '8px')};
  padding-left: 4px;
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '0px' : '80px')};
  transition: max-height 0.5s;
`;

interface Props {
  application: any;
  isExpanded?: boolean;
}

const ProjectInformationForm: React.FC<Props> = ({
  application,
  isExpanded,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment ProjectInformationForm_application on Application {
        id
        rowId
        amendmentNumbers
        ccbcNumber
        projectInformation {
          id
          jsonData
        }
        changeRequestDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          orderBy: AMENDMENT_NUMBER_DESC
          first: 999
        )
          @connection(
            key: "ChangeRequestForm_changeRequestDataByApplicationId"
          ) {
          __id
          edges {
            node {
              id
              rowId
              amendmentNumber
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
    amendmentNumbers,
    ccbcNumber,
    changeRequestDataByApplicationId,
    id,
    rowId,
    projectInformation,
  } = queryFragment;

  const [createProjectInformation] = useCreateProjectInformationMutation();
  const [archiveApplicationSow] = useArchiveApplicationSowMutation();
  const [createChangeRequest] = useCreateChangeRequestMutation();
  const { notifyDocumentUpload } = useEmailNotification();
  const [hasFormSaved, setHasFormSaved] = useState<boolean>(false);
  const [formData, setFormData] = useState(projectInformation?.jsonData);
  const [showToast, setShowToast] = useState(false);
  const [sowFile, setSowFile] = useState(null);
  const [sowValidationErrors, setSowValidationErrors] = useState([]);
  const [isFormEditMode, setIsFormEditMode] = useState(
    !projectInformation?.jsonData?.hasFundingAgreementBeenSigned
  );
  const [isChangeRequest, setIsChangeRequest] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const [currentChangeRequestData, setCurrentChangeRequestData] =
    useState(null);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const apiPath = `/api/analyst/sow/${rowId}/${ccbcNumber}/${
    isChangeRequest ? formData?.amendmentNumber : 0
  }`;

  const validateSow = useCallback(
    excelValidateGenerator(apiPath, setSowFile, setSowValidationErrors),
    [setSowFile, setSowValidationErrors, apiPath]
  );

  const hasSowValidationErrors =
    sowValidationErrors.length > 0 || sowFile === null;

  const getSaveButtonText = useCallback(() => {
    if (!hasSowValidationErrors) {
      return 'Save & Import Data';
    }

    if (hasFormSaved) {
      return 'Saved';
    }

    return 'Save';
  }, [hasSowValidationErrors, hasFormSaved]);

  const projectInformationData = projectInformation?.jsonData;
  const changeRequestData =
    changeRequestDataByApplicationId &&
    [...changeRequestDataByApplicationId.edges]
      .filter((data) => {
        // Removing the old node with relay updater was leaving null values in the array
        // Might be a better way to delete the node so we don't have to filter it out
        return data.node !== null;
      })
      .sort((a, b) => {
        return b.node.amendmentNumber - a.node.amendmentNumber;
      });

  const connectionId = changeRequestDataByApplicationId?.__id;

  const formSchema = isChangeRequest
    ? changeRequestSchema
    : projectInformationSchema;
  const uiSchema = isChangeRequest
    ? changeRequestUiSchema
    : projectInformationUiSchema;

  const hasFundingAgreementBeenSigned =
    projectInformation?.jsonData?.hasFundingAgreementBeenSigned;

  const hasFormErrors = useMemo(() => {
    if (formData === null) {
      return false;
    }
    const formErrors = Ajv8Validator.validateFormData(
      formData,
      formSchema
    )?.errors;
    // not sure about these enum or oneOf errors, filtering them out as a very hacky solution
    const filteredErrors = formErrors?.filter((error) => {
      return (
        error.message !== 'must be string' &&
        error.name !== 'enum' &&
        error.name !== 'oneOf'
      );
    });

    const isFormValid = filteredErrors.length <= 0;
    return !isFormValid;
  }, [formData]);

  const validate = (jsonData, errors) => {
    if (
      amendmentNumbers
        ?.split(' ')
        .includes(jsonData?.amendmentNumber?.toString()) &&
      currentChangeRequestData?.amendmentNumber !== jsonData?.amendmentNumber
    ) {
      errors.amendmentNumber.addError("Can't be a duplicate amendment number");
    }
    return errors;
  };

  const handleResetFormData = (isEditMode = false) => {
    setFormData({});
    setIsFormEditMode(isEditMode);
    setIsFormSubmitting(false);
    setSowFile(null);
    setShowToast(false);
    setIsSubmitAttempted(false);
  };

  const notifySowUpload = (params = {}) => {
    fetch('/api/email/notifySowUpload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: rowId,
        host: window.location.origin,
        ccbcNumber,
        params,
      }),
    }).then((response) => {
      if (!response.ok) {
        Sentry.captureException({
          name: 'Error sending email to notify SOW upload',
          message: response,
        });
      }
      return response.json();
    });

    notifyDocumentUpload(rowId, {
      ccbcNumber,
      documentType: 'Statement of Work',
      documentNames: [sowFile.name],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitAttempted(true);

    hiddenSubmitRef.current.click();

    setIsFormSubmitting(true);

    const changeRequestAmendmentNumber = formData?.amendmentNumber;
    const oldChangeRequestAmendmentNumber =
      currentChangeRequestData?.jsonData?.amendmentNumber;

    // Allow form to be submitted if editing a change request and no change to amendment number
    const isSameAmendmentNumber =
      oldChangeRequestAmendmentNumber &&
      changeRequestAmendmentNumber === oldChangeRequestAmendmentNumber;

    // check if amendment number is being used by another change request and also allow same amendment number to be valid if editing a form (isSameAmendmentNumber)
    const isAmendmentValid =
      !amendmentNumbers
        ?.split(' ')
        .includes(changeRequestAmendmentNumber?.toString()) ||
      isSameAmendmentNumber;

    const isOriginalSowFormInvalid =
      !isChangeRequest &&
      hasFormErrors &&
      formData.hasFundingAgreementBeenSigned;

    const latestAmendment = changeRequestData?.[0]?.node?.amendmentNumber;

    const isChangeRequestFormInvalid =
      isChangeRequest && (hasFormErrors || !isAmendmentValid);

    if (isOriginalSowFormInvalid || isChangeRequestFormInvalid) {
      setIsFormSubmitting(false);
      return;
    }

    if (!formData.hasFundingAgreementBeenSigned && !isChangeRequest) {
      // archive by application id
      archiveApplicationSow({
        variables: {
          input: { _amendmentNumber: 0, _applicationId: rowId },
        },
      });
    }

    validateSow(sowFile, false)
      .then((response) => {
        const isSowErrors = sowValidationErrors.length > 0;
        const isSowUploaded =
          formData?.statementOfWorkUpload?.length > 0 && sowFile !== null;

        // If there are sow errors, persist sow error in form data if not delete
        const newFormData = { ...formData };
        if (isSowErrors) {
          newFormData.isSowUploadError = true;
        } else if (isSowUploaded) {
          delete newFormData?.isSowUploadError;
        }
        if (isChangeRequest) {
          createChangeRequest({
            variables: {
              connections: [connectionId],
              input: {
                _applicationId: rowId,
                _amendmentNumber: changeRequestAmendmentNumber,
                _jsonData: newFormData,
                _oldChangeRequestId: parseInt(
                  currentChangeRequestData?.rowId,
                  10
                ),
              },
            },
            onCompleted: () => {
              handleResetFormData();

              if (isSowUploaded && response?.status === 200) {
                // send email notification to notify the analyst that the sow has been uploaded
                // if this is the latest SOW
                if (latestAmendment <= changeRequestAmendmentNumber) {
                  notifySowUpload({
                    amendmentNumber: changeRequestAmendmentNumber,
                  });
                }
                setShowToast(true);
              }

              setCurrentChangeRequestData(null);
            },
            updater: (store) => {
              // add new amendment number to the amendment numbers computed column
              const applicationStore = store.get(id);

              // remove amendment number if editing a change request and changing the amendment number
              const newAmendmentNumbers = !isSameAmendmentNumber
                ? amendmentNumbers
                    .split(' ')
                    .filter(
                      (number) =>
                        number !== oldChangeRequestAmendmentNumber?.toString()
                    )
                    .join(' ')
                : amendmentNumbers;

              const updatedAmendmentNumbers = `${newAmendmentNumbers} ${changeRequestAmendmentNumber}`;

              applicationStore.setValue(
                updatedAmendmentNumbers,
                'amendmentNumbers'
              );

              // Don't need to update store if we are creating a new change request
              if (!currentChangeRequestData?.id) return;
              const relayConnectionId = changeRequestDataByApplicationId.__id;
              // Get the connection from the store

              const connection = store.get(relayConnectionId);

              store.delete(currentChangeRequestData.id);
              // Remove the old announcement from the connection
              ConnectionHandler.deleteNode(
                connection,
                currentChangeRequestData.id
              );
            },
            onError: () => {
              setIsFormSubmitting(false);
            },
          });
        } else {
          createProjectInformation({
            variables: {
              input: { _applicationId: rowId, _jsonData: newFormData },
            },
            onCompleted: () => {
              handleResetFormData(!formData?.hasFundingAgreementBeenSigned);
              setHasFormSaved(true);
              if (isSowUploaded && response?.status === 200) {
                if (!latestAmendment) notifySowUpload();
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
            onError: () => {
              setIsFormSubmitting(false);
            },
          });
        }
      })
      .catch(() => {
        setIsFormSubmitting(false);
      });
  };

  const isOriginalSowUpload = projectInformation?.jsonData;
  return (
    <StyledProjectForm
      additionalContext={{
        amendmentNumbers,
        applicationId: rowId,
        excelValidationErrors: sowValidationErrors,
        validateExcel: validateSow,
        currentAmendmentNumber: currentChangeRequestData?.amendmentNumber,
      }}
      before={
        <StyledFlex isFormEditMode={isFormEditMode}>
          {isOriginalSowUpload && (
            <AddButton
              isFormEditMode={isFormEditMode}
              onClick={() => {
                setIsSubmitAttempted(false);
                setIsChangeRequest(true);
                setFormData({});
                setShowToast(false);
                setIsFormEditMode(true);
              }}
              title="Add change request"
            />
          )}
          <MetabaseLink
            href={`https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/90-prod-sow-data-dashboard?ccbc_number=${ccbcNumber}`}
            text="View project data in Metabase"
            testHref={`https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/89-sow-data-dashboard-test?ccbc_number=${ccbcNumber}`}
            width={326}
          />
        </StyledFlex>
      }
      formData={formData}
      handleChange={(e) => {
        setHasFormSaved(false);
        if (!isChangeRequest && !e.formData.hasFundingAgreementBeenSigned) {
          setFormData({});
        } else {
          setFormData({ ...e.formData });
        }
      }}
      liveValidate={isSubmitAttempted && isFormEditMode}
      isExpanded={isExpanded}
      isFormEditMode={isFormEditMode}
      title="Funding agreement, statement of work, & map"
      formAnimationHeight={isChangeRequest ? 3000 : 800}
      formAnimationHeightOffset={68}
      isFormAnimated
      schema={formSchema}
      theme={isChangeRequest ? ChangeRequestTheme : ProjectTheme}
      uiSchema={uiSchema}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      saveBtnText={getSaveButtonText()}
      setFormData={setFormData}
      submittingText="Importing Statement of Work. Please wait."
      submitting={
        !hasSowValidationErrors &&
        !hasFormErrors &&
        sowFile &&
        formData.statementOfWorkUpload &&
        isFormSubmitting
      }
      saveBtnDisabled={isFormSubmitting}
      setIsFormEditMode={(isEditMode: boolean) => {
        setShowToast(false);
        setIsFormEditMode(isEditMode);
        setIsChangeRequest((_isChangeRequest) =>
          isEditMode ? false : _isChangeRequest
        );
      }}
      showEditBtn={!hasFundingAgreementBeenSigned && !isFormEditMode}
      hiddenSubmitRef={hiddenSubmitRef}
      validate={validate}
    >
      {changeRequestData?.map((changeRequest) => {
        const {
          id: changeRequestId,
          amendmentNumber,
          jsonData,
        } = changeRequest.node;

        const {
          additionalComments,
          changeRequestFormUpload,
          dateApproved,
          dateRequested,
          descriptionOfChanges,
          levelOfAmendment,
          statementOfWorkUpload,
          updatedMapUpload,
          otherFiles,
        } = jsonData || {};

        // Need to pass in correct values once the change request metadata ticket is complete
        return (
          <ReadOnlyView
            key={changeRequestId}
            additionalComments={additionalComments}
            changeRequestForm={changeRequestFormUpload?.[0]}
            date={dateApproved}
            dateRequested={dateRequested}
            descriptionOfChanges={descriptionOfChanges}
            levelOfAmendment={levelOfAmendment}
            title={`Amendment #${amendmentNumber}`}
            onFormEdit={() => {
              setIsChangeRequest(true);
              setIsFormEditMode(true);
              setCurrentChangeRequestData(changeRequest.node);
              setFormData(jsonData);
              setShowToast(false);
            }}
            isChangeRequest
            isFormEditMode={isFormEditMode}
            isSowUploadError={jsonData?.isSowUploadError}
            maps={updatedMapUpload}
            sow={statementOfWorkUpload?.[0]}
            otherFiles={otherFiles}
          />
        );
      })}
      {hasFundingAgreementBeenSigned && (
        <ReadOnlyView
          date={projectInformationData?.dateFundingAgreementSigned}
          title="Original"
          onFormEdit={() => {
            setIsChangeRequest(false);
            setFormData(projectInformationData);
            setIsFormEditMode(true);
            setShowToast(false);
          }}
          isFormEditMode={isFormEditMode}
          isSowUploadError={projectInformationData?.isSowUploadError}
          maps={projectInformationData?.finalizedMapUpload}
          sow={projectInformationData?.statementOfWorkUpload?.[0]}
          fundingAgreement={projectInformationData?.fundingAgreementUpload?.[0]}
          wirelessSow={projectInformationData?.sowWirelessUpload?.[0]}
          otherFiles={projectInformationData?.otherFiles}
        />
      )}
      {showToast && (
        <Toast timeout={5000}>Statement of work successfully imported</Toast>
      )}
    </StyledProjectForm>
  );
};

export default ProjectInformationForm;
