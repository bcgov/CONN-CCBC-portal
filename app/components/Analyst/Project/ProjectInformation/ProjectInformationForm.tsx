import { useCallback, useMemo, useRef, useState } from 'react';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import config from 'config';
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

// import validateFormData from '@rjsf/core/dist/cjs/validate';
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
  padding-bottom: ${(props) => (props.isFormEditMode ? '0px' : '8px')};
  padding-left: 4px;
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
    ccbcNumber,
    changeRequestDataByApplicationId,
    id,
    rowId,
    projectInformation,
  } = queryFragment;

  const [createProjectInformation] = useCreateProjectInformationMutation();
  const [archiveApplicationSow] = useArchiveApplicationSowMutation();
  const [createChangeRequest] = useCreateChangeRequestMutation();
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

  const validateSow = useCallback(
    sowValidateGenerator(rowId, ccbcNumber, setSowFile, setSowValidationErrors),
    [rowId, ccbcNumber, setSowFile, setSowValidationErrors]
  );

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

  // This will change to amendment number once we add the amendment field
  const newAmendmentNumber = changeRequestData.length + 1;
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
    // const formErrors = validateFormData(
    //   formData,
    //   projectInformationSchema
    // )?.errors;
    //
    const formErrors = [];

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
    setIsFormSubmitting(true);
    hiddenSubmitRef.current.click();

    const changeRequestAmendmentNumber =
      currentChangeRequestData?.amendmentNumber || newAmendmentNumber;

    if (hasFormErrors && formData.hasFundingAgreementBeenSigned) {
      setIsFormSubmitting(false);
      return;
    }

    if (!formData.hasFundingAgreementBeenSigned && !isChangeRequest) {
      // archive by application id
      archiveApplicationSow({
        variables: {
          input: { _amendmentNumber: 0 },
        },
      });
    }
    validateSow(
      sowFile,
      isChangeRequest ? changeRequestAmendmentNumber : 0,
      false
    ).then((response) => {
      if (isChangeRequest) {
        createChangeRequest({
          variables: {
            connections: [connectionId],
            input: {
              _applicationId: rowId,
              _amendmentNumber: changeRequestAmendmentNumber,
              _jsonData: formData,
            },
          },
          onCompleted: () => {
            setIsFormEditMode(false);
            setIsFormSubmitting(false);
            setFormData({});
            // May need to change when the toast is shown when we add validation
            if (response?.status === 200) {
              setShowToast(true);
            }
            setCurrentChangeRequestData(null);
            setShowToast(true);
          },
          updater: (store) => {
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
            input: { _applicationId: rowId, _jsonData: formData },
          },
          onCompleted: () => {
            setIsFormEditMode(false);
            setIsFormSubmitting(false);
            setFormData({});
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
          onError: () => {
            setIsFormSubmitting(false);
          },
        });
      }
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
    projectInformation?.jsonData?.statementOfWorkUpload?.[0];
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
                setFormData({});
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
        if (!isChangeRequest && !e.formData.hasFundingAgreementBeenSigned) {
          setFormData({
            hasFundingAgreementBeenSigned: false,
          });
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
      setFormData={setFormData}
      submitting={isFormSubmitting}
      saveBtnDisabled={isFormSubmitting}
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      showEditBtn={
        !hasFundingAgreementBeenSigned && !isFormEditMode && !isChangeRequest
      }
      hiddenSubmitRef={hiddenSubmitRef}
    >
      {changeRequestData?.map((changeRequest) => {
        const {
          id: changeRequestId,
          amendmentNumber,
          jsonData,
        } = changeRequest.node;

        // Need to pass in correct values once the change request metadata ticket is complete
        return (
          <ReadOnlyView
            key={changeRequestId}
            date={jsonData?.dateChangeRequestApproved}
            title={`Amendment #${amendmentNumber}`}
            onFormEdit={() => {
              setIsChangeRequest(true);
              setIsFormEditMode(true);
              setCurrentChangeRequestData(changeRequest.node);
              setFormData(jsonData);
            }}
            isChangeRequest
            isFormEditMode={isFormEditMode}
            sow={jsonData?.statementOfWorkUpload?.[0]}
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
          }}
          isFormEditMode={isFormEditMode}
          map={projectInformationData?.finalizedMapUpload?.[0]}
          sow={projectInformationData?.statementOfWorkUpload?.[0]}
          fundingAgreement={projectInformationData?.fundingAgreementUpload?.[0]}
          wirelessSow={projectInformationData?.sowWirelessUpload?.[0]}
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
