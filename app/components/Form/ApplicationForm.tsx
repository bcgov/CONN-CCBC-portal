import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { IChangeEvent } from '@rjsf/core';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import reportClientError from 'lib/helpers/reportClientError';
import validate from 'formSchema/validate';
import uiSchema from 'formSchema/uiSchema/uiSchema';
import uiSchemaV3 from 'formSchema/uiSchema/uiSchemaV3';
import { ApplicationForm_application$key } from '__generated__/ApplicationForm_application.graphql';
import { UseDebouncedMutationConfig } from 'schema/mutations/useDebouncedMutation';
import { ApplicationForm_query$key } from '__generated__/ApplicationForm_query.graphql';
import { useSubmitApplicationMutation } from 'schema/mutations/application/submitApplication';
import { acknowledgementsEnum } from 'formSchema/pages/acknowledgements';
import { updateApplicationFormMutation } from '__generated__/updateApplicationFormMutation.graphql';
import { useUpdateApplicationForm } from 'schema/mutations/application/updateApplicationForm';
import verifyFormFields from 'utils/verifyFormFields';
import ReviewField from 'components/Review/ReviewPageField';
import { useFeature } from '@growthbook/growthbook-react';
import { applicantBenefits as applicantBenefitsSchema } from 'formSchema/pages';
import { applicantBenefits } from 'formSchema/uiSchema/pages';
import useModal from 'lib/helpers/useModal';
import { RJSFSchema } from '@rjsf/utils';
import GenericConfirmationModal from 'lib/theme/widgets/GenericConfirmationModal';
import ALL_INTAKE_ZONES from 'data/intakeZones';
import SubmitButtons from './SubmitButtons';
import FormBase from './FormBase';
import {
  calculateApplicantFunding,
  calculateContractorEmployment,
  calculateFundingPartner,
  calculateFundingRequestedCCBC,
  calculateInfrastructureFunding,
  calculateProjectEmployment,
} from '../../lib/theme/customFieldCalculations';
import ApplicationFormStatus from './ApplicationFormStatus';
import {
  getFilteredSchemaOrderFromUiSchema,
  getSectionNameFromPageNumber,
  schemaToSubschemasArray,
} from '../../utils/schemaUtils';
import ConflictModal from './ConflictModal';
import ProjectAreaModal from './ProjectAreaModal';

const verifyAllSubmissionsFilled = (formData?: SubmissionFieldsJSON) => {
  const isSubmissionCompletedByFilled =
    formData?.submissionCompletedBy?.length > 0;
  const isSubmissionCompletedForFilled =
    formData?.submissionCompletedFor?.length > 0;
  const isSubmissionDateFilled = formData?.submissionDate?.length > 0;
  const isSubmissionTitleFilled = formData?.submissionTitle?.length > 0;

  return (
    isSubmissionCompletedByFilled &&
    isSubmissionCompletedForFilled &&
    isSubmissionDateFilled &&
    isSubmissionTitleFilled
  );
};

const verifyAllAcknowledgementsChecked = (
  formData?: AcknowledgementsFieldJSON
) => formData?.acknowledgementsList?.length === acknowledgementsEnum.length;

export const calculate = (sectionData, sectionName: string) => ({
  ...sectionData,
  ...(sectionName === 'estimatedProjectEmployment' && {
    ...calculateProjectEmployment(sectionData),
    ...calculateContractorEmployment(sectionData),
  }),
  ...(sectionName === 'projectFunding' && {
    ...calculateFundingRequestedCCBC(sectionData),
    ...calculateApplicantFunding(sectionData),
  }),
  ...(sectionName === 'otherFundingSources' && {
    ...calculateInfrastructureFunding(sectionData),
    ...calculateFundingPartner(sectionData),
  }),
});

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

interface Props {
  pageNumber: number;
  application: ApplicationForm_application$key;
  query: ApplicationForm_query$key;
}

interface AcknowledgementsFieldJSON {
  acknowledgementsList: Array<string>;
}

interface SubmissionFieldsJSON {
  submissionCompletedFor?: string;
  submissionDate?: string;
  submissionCompletedBy?: string;
  submissionTitle?: string;
}

export const mergeFormSectionData = (
  formData,
  formSectionName,
  calculatedSection,
  jsonSchema
) => {
  const schemaSection = jsonSchema.properties[formSectionName];

  const handleError = (error) => {
    reportClientError(error, {
      source: 'application-form-invalid-field',
      metadata: { message: error },
    });
  };

  // TODO: The code below should be simplified. It is potentially confusing as it only allows
  // deleting field from a section by setting them to undefined.
  // Some of our code potentially relies on this behaviour, and there are related rjsf v4 bugs
  // that can lead to the previous form's data being erased when we change pages
  // https://github.com/rjsf-team/react-jsonschema-form/issues/1708
  let newFormData: Record<string, any> = {};
  if (Object.keys(formData).length === 0) {
    newFormData[formSectionName] = calculatedSection;
  } else if (formData[formSectionName]) {
    newFormData = { ...formData };
    newFormData[formSectionName] = {
      ...verifyFormFields(
        newFormData[formSectionName],
        schemaSection,
        handleError
      ),
      ...verifyFormFields(calculatedSection, schemaSection, handleError),
    };
  } else {
    newFormData = { ...formData };
    newFormData[formSectionName] = { ...calculatedSection };
  }

  return newFormData;
};

const ApplicationForm: React.FC<Props> = ({
  pageNumber,
  application: applicationKey,
  query,
}) => {
  const application = useFragment(
    graphql`
      fragment ApplicationForm_application on Application {
        rowId
        formData {
          id
          rowId
          jsonData
          isEditable
          updatedAt
          formByFormSchemaId {
            rowId
            jsonSchema
          }
        }
        status
        intakeByIntakeId {
          ccbcIntakeNumber
          closeTimestamp
          allowUnlistedFnLedZones
          zones
        }
        ...ApplicationFormStatus_application
      }
    `,
    applicationKey
  );

  const applicationFormQuery = useFragment(
    graphql`
      fragment ApplicationForm_query on Query {
        openIntake {
          closeTimestamp
          ccbcIntakeNumber
          rollingIntake
          allowUnlistedFnLedZones
          zones
          hiddenCode
          hidden
          rowId
        }
        allIntakes(
          first: 1
          orderBy: CCBC_INTAKE_NUMBER_DESC
          condition: { archivedAt: null, hidden: false }
        ) @connection(key: "ApplicationIntakes_allIntakes") {
          edges {
            node {
              ccbcIntakeNumber
              allowUnlistedFnLedZones
              zones
            }
          }
        }
        allForms(condition: { formType: "intake" }, last: 1) {
          nodes {
            rowId
            jsonSchema
          }
        }
        session {
          ccbcUserBySub {
            rowId
            sessionSub
            intakeUsersByUserId {
              nodes {
                intakeId
              }
            }
          }
        }
      }
    `,
    query
  );

  const draftAppsUseLatestSchema = useFeature('draft_apps_use_latest_schema');
  const forceLatestSchema =
    draftAppsUseLatestSchema?.value &&
    typeof draftAppsUseLatestSchema.value === 'boolean'
      ? draftAppsUseLatestSchema?.value
      : null;
  const { openIntake, allIntakes, session } = applicationFormQuery;
  const latestJsonSchema = applicationFormQuery.allForms.nodes[0].jsonSchema;
  const latestFormSchemaId = applicationFormQuery.allForms.nodes[0].rowId;
  const {
    rowId,
    formData: {
      jsonData,
      rowId: formDataRowId,
      id: formDataId,
      isEditable,
      updatedAt,
    },
    status,
  } = application;
  const isInviteOnlyIntake = openIntake?.hiddenCode && !openIntake?.hidden;
  const hasIntakeAccess =
    session?.ccbcUserBySub?.intakeUsersByUserId?.nodes.some(
      (node) => node.intakeId === openIntake?.rowId
    );
  // disable edit if user does not have access to invite only intake
  const isApplicationEditable =
    isEditable && !(isInviteOnlyIntake && !hasIntakeAccess);
  const ccbcIntakeNumber =
    application.intakeByIntakeId?.ccbcIntakeNumber || null;
  const latestIntakeNumber =
    openIntake?.ccbcIntakeNumber ??
    allIntakes?.edges[0]?.node?.ccbcIntakeNumber;
  const isRollingIntake = openIntake?.rollingIntake ?? false;
  const allowUnlistedFnLedZones =
    application.intakeByIntakeId?.allowUnlistedFnLedZones ??
    openIntake?.allowUnlistedFnLedZones ??
    allIntakes?.edges[0]?.node?.allowUnlistedFnLedZones ??
    true;

  const intakeZones =
    application.intakeByIntakeId?.zones ??
    openIntake?.zones ??
    allIntakes?.edges[0]?.node?.zones;
  const acceptedProjectAreasArray = [...(intakeZones ?? ALL_INTAKE_ZONES)];

  let jsonSchema: any;
  let formSchemaId: number;
  let finalUiSchema: any;
  // eslint-disable-next-line no-constant-condition, no-self-compare
  if (forceLatestSchema && status === 'draft') {
    jsonSchema = latestJsonSchema;
    formSchemaId = latestFormSchemaId;
  } else {
    jsonSchema = application.formData.formByFormSchemaId.jsonSchema;
    formSchemaId = application.formData.formByFormSchemaId.rowId;
  }
  const filteredUiSchemaOrder = getFilteredSchemaOrderFromUiSchema(
    jsonSchema,
    uiSchema
  );
  if (ccbcIntakeNumber !== null && ccbcIntakeNumber <= 2) {
    finalUiSchema = {
      ...uiSchema,
      'ui:order': filteredUiSchemaOrder,
    };
  } else {
    // if it is intake 4, use v3 of UIschema
    const isIntake4AndAfter =
      latestIntakeNumber >= 4 &&
      (ccbcIntakeNumber === null || ccbcIntakeNumber >= 4);
    finalUiSchema = {
      ...(isIntake4AndAfter ? uiSchemaV3 : uiSchema),
      benefits: {
        ...applicantBenefits,
      },
      'ui:order': filteredUiSchemaOrder,
    };
    jsonSchema = {
      ...jsonSchema,
      properties: {
        ...jsonSchema.properties,
        ...applicantBenefitsSchema,
      },
    };
  }
  const formErrorSchema = useMemo(
    () => validate(jsonData, jsonSchema),
    [jsonData, jsonSchema]
  );

  const sectionName = getSectionNameFromPageNumber(finalUiSchema, pageNumber);
  const noErrors = Object.keys(formErrorSchema).length === 0;

  const [savingError, setSavingError] = useState(null);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const projectAreaModal = useModal();
  const submissionConfirmationModal = useModal();

  const [isProjectAreaSelected, setProjectAreaSelected] = useState(
    jsonData?.projectArea?.geographicArea?.length > 0
  );
  const [isProjectAreaInvalid, setIsProjectAreaInvalid] = useState(
    !acceptedProjectAreasArray.includes(
      jsonData?.projectArea?.geographicArea?.[0]
    ) && !(allowUnlistedFnLedZones && jsonData?.projectArea?.firstNationsLed)
  );
  const [projectAreaModalType, setProjectAreaModalType] = useState('');
  const [areAllAcknowledgementsChecked, setAreAllacknowledgementsChecked] =
    useState(verifyAllAcknowledgementsChecked(jsonData.acknowledgements));
  const [areAllSubmissionFieldsSet, setAreAllSubmissionFieldsSet] = useState(
    verifyAllSubmissionsFilled(jsonData.submission)
  );
  const [isAcknowledgeIncomplete, setIsAcknowledgeIncomplete] = useState(
    jsonData?.review?.acknowledgeIncomplete || false
  );
  const [templateData, setTemplateData] = useState(null);
  const conflictModal = useModal();

  const formContext = useMemo(() => {
    const intakeCloseTimestamp =
      application?.intakeByIntakeId?.closeTimestamp ||
      openIntake?.closeTimestamp;

    const intakeNumber = ccbcIntakeNumber ?? latestIntakeNumber;

    return {
      intakeCloseTimestamp,
      fullFormData: jsonData,
      formSchema: jsonSchema,
      formErrorSchema,
      isEditable: isApplicationEditable,
      areAllAcknowledgementsChecked,
      rowId,
      finalUiSchema,
      setTemplateData,
      isProjectAreaInvalid,
      acceptedProjectAreasArray,
      isProjectAreaSelected,
      intakeNumber,
      isRollingIntake,
      allowUnlistedFnLedZones,
      skipUnsavedWarning: true,
    };
  }, [
    openIntake,
    application?.intakeByIntakeId?.closeTimestamp,
    formErrorSchema,
    isEditable,
    isApplicationEditable,
    areAllAcknowledgementsChecked,
    rowId,
    jsonSchema,
    isProjectAreaInvalid,
    acceptedProjectAreasArray,
    isProjectAreaSelected,
    latestIntakeNumber,
    ccbcIntakeNumber,
    isRollingIntake,
    allowUnlistedFnLedZones,
  ]);

  const updateAreAllAcknowledgementFieldsSet = (
    akcnowledgementsList: AcknowledgementsFieldJSON
  ) => {
    setAreAllacknowledgementsChecked(
      verifyAllAcknowledgementsChecked(akcnowledgementsList)
    );

    return akcnowledgementsList;
  };

  const updateAreAllSubmissionFieldsSet = (
    submissionFields: SubmissionFieldsJSON
  ) => {
    setAreAllSubmissionFieldsSet(verifyAllSubmissionsFilled(submissionFields));

    return submissionFields;
  };

  const router = useRouter();
  const [submitApplication, isSubmitting] = useSubmitApplicationMutation();
  const [updateApplicationForm, isUpdating] = useUpdateApplicationForm();

  const subschemaArray: [string, RJSFSchema][] = schemaToSubschemasArray(
    jsonSchema as object
  );

  const sectionSchema = jsonSchema.properties[sectionName] as RJSFSchema;
  const isWithdrawn = status === 'withdrawn';
  const isSubmitted = status === 'submitted';
  const isSubmitPage = sectionName === 'submission';
  const isAcknowledgementPage = sectionName === 'acknowledgements';
  const isProjectAreaPage = sectionName === 'projectArea';
  const isOtherFundingSourcesPage = sectionName === 'otherFundingSources';
  const isReviewPage = sectionName === 'review';

  const isAllZoneIntake =
    isProjectAreaPage &&
    acceptedProjectAreasArray.length ===
      (sectionSchema.properties?.geographicArea as any)?.items?.enum?.length;

  const isZoneSelectionValid = (
    geographicAreaInput: number[],
    isFirstNationsLed: boolean,
    isNullAllowed: boolean = true
  ) => {
    // null selection not allowed in submitted project area page
    if (!isNullAllowed && geographicAreaInput?.length === 0) return false;
    const isFirstNationsException =
      allowUnlistedFnLedZones && isFirstNationsLed;
    return (
      isAllZoneIntake ||
      isFirstNationsException ||
      acceptedProjectAreasArray.includes(geographicAreaInput?.[0])
    );
  };

  const getProjectAreaModalType = (
    geographicAreaInputChanged: boolean,
    firstNationsLedInputChanged: boolean
  ) => {
    if (isSubmitted && geographicAreaInputChanged) {
      // display new modal saying
      // Invalid selection. You have indicated that this project is not led or supported by First Nations, therefore, you may only choose from zones 1,2,3 or 6.
      return 'invalid-geographic-area';
    }
    if (isSubmitted && firstNationsLedInputChanged) {
      // display modal saying
      // Invalid selection. Please first choose from zones 1,2,3 or 6 if this project is not supported or led by First Nations
      return allowUnlistedFnLedZones
        ? 'first-nations-led'
        : 'invalid-geographic-area';
    }
    return 'pre-submitted';
  };

  const isSubmitEnabled = useMemo(() => {
    if (isUpdating) return false;

    if (isWithdrawn) return false;

    if (sectionName === 'review')
      return noErrors || jsonData.review?.acknowledgeIncomplete;

    if (sectionName === 'acknowledgements')
      return areAllAcknowledgementsChecked || isSubmitted;

    if (sectionName === 'submission')
      return (
        areAllSubmissionFieldsSet &&
        areAllAcknowledgementsChecked &&
        (noErrors || isAcknowledgeIncomplete) &&
        !isSubmitted &&
        isApplicationEditable &&
        !isProjectAreaInvalid &&
        isProjectAreaSelected
      );

    return true;
  }, [
    sectionName,
    noErrors,
    areAllAcknowledgementsChecked,
    areAllSubmissionFieldsSet,
    isWithdrawn,
    jsonData,
    isSubmitted,
    isApplicationEditable,
    isAcknowledgeIncomplete,
    isUpdating,
    isProjectAreaInvalid,
    isProjectAreaSelected,
  ]);

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }

  const notifyRollingApplicationSubmission = () => {
    fetch(`/api/email/notifyApplicationSubmission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: rowId,
        host: window.location.origin,
      }),
    }).then((response) => {
      if (!response.ok) {
        reportClientError(response, {
          source: 'application-submit-email',
        });
      }
      return response.json();
    });
  };

  const createTemplateNineData = (id, uuid) => {
    fetch(`/api/template-nine/${id}/${uuid}/application`);
  };

  const saveForm = (
    newFormSectionData: any,
    mutationConfig?: Partial<
      UseDebouncedMutationConfig<updateApplicationFormMutation>
    >,
    isRedirectingToNextPage = false,
    isSaveAsDraftBtn = false
  ) => {
    const calculatedSectionData = calculate(
      newFormSectionData,
      sectionName.toString()
    );

    let newFormData = mergeFormSectionData(
      jsonData,
      sectionName,
      calculatedSectionData,
      jsonSchema
    );

    if (isAcknowledgementPage) {
      updateAreAllAcknowledgementFieldsSet(newFormSectionData);
    }
    if (isSubmitPage) {
      updateAreAllSubmissionFieldsSet(newFormSectionData);
    }
    if (isReviewPage) {
      setIsAcknowledgeIncomplete(
        newFormSectionData?.acknowledgeIncomplete || false
      );
    }
    if (isProjectAreaPage) {
      const firstNationsLed = newFormSectionData?.firstNationsLed || false;
      const geographicAreaInputChanged =
        typeof newFormSectionData?.geographicArea?.[0] !== 'undefined' &&
        newFormSectionData?.geographicArea[0] !==
          jsonData.projectArea?.geographicArea?.[0];
      const firstNationsLedInputChanged =
        typeof newFormSectionData?.firstNationsLed !== 'undefined' &&
        firstNationsLed !== jsonData.projectArea?.firstNationsLed;

      const isProjectAreaAccepted = isZoneSelectionValid(
        newFormSectionData?.geographicArea,
        firstNationsLed,
        !isSubmitted
      );

      if (!isProjectAreaAccepted) {
        if (isSubmitted) {
          // revert form data
          newFormData = {
            ...jsonData,
          };
        }
        const shouldOpenProjectAreaModal =
          (geographicAreaInputChanged || firstNationsLedInputChanged) &&
          !(firstNationsLedInputChanged && !firstNationsLed);

        if (shouldOpenProjectAreaModal) {
          setProjectAreaModalType(
            getProjectAreaModalType(
              geographicAreaInputChanged,
              firstNationsLedInputChanged
            )
          );
          projectAreaModal.open();
        }
      }

      // Setting below properties to handle validation errors separately in submission page
      // Setting if user has selected a project area
      setProjectAreaSelected(
        newFormData?.projectArea?.geographicArea?.length > 0
      );
      // calculating project area selection validity to clearout temporary values
      // calculated for error handling/error modals
      const projectAreaValid = isZoneSelectionValid(
        newFormData?.projectArea?.geographicArea,
        newFormData?.projectArea?.firstNationsLed
      );

      setIsProjectAreaInvalid(!projectAreaValid);
    }

    if (templateData) {
      if (templateData.templateNumber === 1 && !templateData.error) {
        newFormData = {
          ...newFormData,
          benefits: {
            ...newFormData.benefits,
            householdsImpactedIndigenous:
              templateData.data.result.totalNumberHouseholdsImpacted,
            numberOfHouseholds:
              templateData.data.result.finalEligibleHouseholds,
          },
        };
      } else if (templateData.templateNumber === 2 && !templateData.error) {
        newFormData = {
          ...newFormData,
          budgetDetails: {
            ...newFormData.budgetDetails,
            totalEligibleCosts: templateData.data.result.totalEligibleCosts,
            totalProjectCost: templateData.data.result.totalProjectCosts,
          },
        };
      } else if (templateData.error && templateData.templateNumber === 1) {
        fetch(`/api/email/notifyFailedReadOfTemplateData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId: rowId,
            host: window.location.origin,
            params: {
              uuid: newFormData.templateUploads
                ?.eligibilityAndImpactsCalculator?.[0]?.uuid,
              uploadedAt:
                newFormData.templateUploads
                  ?.eligibilityAndImpactsCalculator?.[0]?.uploadedAt,
              templateNumber: templateData.templateNumber,
            },
          }),
        });
      } else if (templateData.error && templateData.templateNumber === 2) {
        fetch(`/api/email/notifyFailedReadOfTemplateData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId: rowId,
            host: window.location.origin,
            params: {
              uuid: newFormData.templateUploads?.detailedBudget?.[0]?.uuid,
              uploadedAt:
                newFormData.templateUploads?.detailedBudget?.[0]?.uploadedAt,
              templateNumber: templateData.templateNumber,
            },
          }),
        });
      }
    }

    // remove field otherFundingSources array when otherFundingSources is false as it leaves misleading data
    if (
      isOtherFundingSourcesPage &&
      !newFormData.otherFundingSources.otherFundingSources
    ) {
      delete newFormData.otherFundingSources.otherFundingSourcesArray;
    }

    // if we're redirecting after this, set lastEditedPage to the next page
    const lastEditedPageNumber = isRedirectingToNextPage
      ? pageNumber
      : pageNumber - 1;
    const lastEditedPage =
      pageNumber < subschemaArray.length
        ? finalUiSchema['ui:order'][lastEditedPageNumber]
        : '';

    setSavingError(null);

    updateApplicationForm({
      variables: {
        input: {
          jsonData: newFormData,
          lastEditedPage: isSaveAsDraftBtn ? 'review' : lastEditedPage,
          formDataRowId,
          clientUpdatedAt: updatedAt,
        },
      },
      optimisticResponse: {
        updateApplicationForm: {
          formData: {
            id: formDataId,
            jsonData: newFormData,
            updatedAt: undefined,
            applicationsByApplicationFormDataFormDataIdAndApplicationId:
              undefined,
          },
        },
      },
      debounceKey: formDataId,
      onError: (error) => {
        if (error.message.includes('Data is Out of Sync')) {
          conflictModal.open();
        }
        setSavingError(
          <>
            There was an error saving your response.
            <br />
            Please refresh the page.
          </>
        );
      },
      onCompleted: () => {
        if (isSaveAsDraftBtn) {
          setSavedAsDraft(true);
        }
        setTemplateData(null);
      },
      ...mutationConfig,
    });
  };

  const handleSaveForm = (
    newFormSectionData: any,
    mutationConfig?: Partial<
      UseDebouncedMutationConfig<updateApplicationFormMutation>
    >,
    isRedirectingToNextPage = false,
    isSaveAsDraftBtn = false
  ) => {
    if (!isApplicationEditable) {
      if (pageNumber < subschemaArray.length) {
        router.push(`/applicantportal/form/${rowId}/${pageNumber + 1}`);
      } else {
        router.push(`/applicantportal/form/${rowId}/success`);
      }
      return;
    }
    saveForm(
      newFormSectionData,
      mutationConfig,
      isRedirectingToNextPage,
      isSaveAsDraftBtn
    );
  };

  const handleTemplateNineCreation = () => {
    const templateNineUuid =
      jsonData.templateUploads?.geographicNames?.[0]?.uuid;
    if (templateNineUuid) {
      createTemplateNineData(rowId, templateNineUuid);
    }
  };

  const handleSubmit = (e: IChangeEvent<any>) => {
    if (pageNumber < subschemaArray.length) {
      saveForm(
        e.formData,
        {
          onCompleted: () => {
            if (isSubmitted) {
              handleTemplateNineCreation();
            }
            //  TODO: update rerouting logic to handle when there are form errors etc.
            router.push(`/applicantportal/form/${rowId}/${pageNumber + 1}`);
          },
        },
        true
      );
    } else {
      submitApplication({
        variables: {
          input: {
            applicationRowId: rowId,
            _formSchemaId: formSchemaId,
          },
        },
        onCompleted: () => {
          router.push(`/applicantportal/form/${rowId}/success`);
          handleTemplateNineCreation();
          if (isRollingIntake) notifyRollingApplicationSubmission();
        },
      });
    }
  };

  const handleChange = (e: IChangeEvent<any>) => {
    setSavedAsDraft(false);
    saveForm(e.formData);
  };

  const isFormDisabled = () => {
    const isAcknowledgementOrSubmissionPage =
      sectionName === 'acknowledgements' || sectionName === 'submission';

    return (
      isWithdrawn ||
      (isSubmitted && isAcknowledgementOrSubmissionPage) ||
      !isApplicationEditable
    );
  };

  return (
    <>
      <Flex>
        <h1>{sectionSchema.title}</h1>
        <ApplicationFormStatus
          application={application}
          isSaving={isUpdating}
          error={savingError}
        />
      </Flex>
      <FormBase
        onSubmit={(e) =>
          isRollingIntake && isSubmitPage
            ? submissionConfirmationModal.open()
            : handleSubmit(e)
        }
        onChange={handleChange}
        // Moved here to prevent cycle of FormBase calling the ReviewField through DefaultTheme
        fields={{ ReviewField }}
        formData={jsonData[sectionName]}
        schema={sectionSchema}
        uiSchema={finalUiSchema[sectionName]}
        // Todo: validate entire form on completion
        noValidate
        disabled={isFormDisabled()}
        formContext={formContext}
      >
        <SubmitButtons
          disabled={!isSubmitEnabled || isSubmitting}
          isEditable={isApplicationEditable}
          isUpdating={isUpdating}
          isSubmitPage={isSubmitPage}
          formData={jsonData[sectionName]}
          savedAsDraft={savedAsDraft}
          saveForm={handleSaveForm}
          isAcknowledgementPage={isAcknowledgementPage}
          status={status}
        />
      </FormBase>
      <ConflictModal {...conflictModal} />
      <ProjectAreaModal
        {...projectAreaModal}
        projectAreaModalType={projectAreaModalType}
        acceptedProjectAreasArray={acceptedProjectAreasArray}
        allowUnlistedFnLedZones={allowUnlistedFnLedZones}
      />
      <GenericConfirmationModal
        id="submission-confirm-modal"
        title="Edit"
        message="You are about to submit your application. You will no longer be able to edit after this action."
        okLabel="Confirm Submission"
        cancelLabel="Keep as Draft"
        onConfirm={(e) => {
          handleSubmit(e);
          submissionConfirmationModal.close();
        }}
        onClose={(e) => {
          saveForm(e.formData, {}, false, true);
          submissionConfirmationModal.close();
        }}
        {...submissionConfirmationModal}
      />
    </>
  );
};

export default ApplicationForm;
