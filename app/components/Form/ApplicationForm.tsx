import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { IChangeEvent, ISubmitEvent } from '@rjsf/core';
import { graphql, useFragment } from 'react-relay';
import type { JSONSchema7 } from 'json-schema';
import styled from 'styled-components';
import validate from 'formSchema/validate';
import uiSchema from 'formSchema/uiSchema/uiSchema';
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
    Sentry.captureException({
      name: 'Invalid form field error',
      message: error,
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
        }
        allForms(condition: { formType: "intake" }, last: 1) {
          nodes {
            rowId
            jsonSchema
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
  const acceptedProjectAreas = useFeature('intake_zones');
  const acceptedProjectAreasArray =
    typeof acceptedProjectAreas?.value === 'string'
      ? acceptedProjectAreas?.value?.split(',') || []
      : [];
  const { openIntake } = applicationFormQuery;
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
  const ccbcIntakeNumber =
    application.intakeByIntakeId?.ccbcIntakeNumber || null;
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
    finalUiSchema = {
      ...uiSchema,
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
  const [projectAreaModalOpen, setProjectAreaModalOpen] = useState(false);

  const [isProjectAreaSelected, setProjectAreaSelected] = useState(
    jsonData?.projectArea?.geographicArea?.length > 0
  );
  const [isProjectAreaInvalid, setIsProjectAreaInvalid] = useState(
    !acceptedProjectAreasArray.includes(
      jsonData?.projectArea?.geographicArea?.[0]?.toString()
    ) && !jsonData?.projectArea?.firstNationsLed
  );
  const [projectAreaModalType, setProjectAreaModalType] = useState('');
  const [areAllAcknowledgementsChecked, setAreAllacknowledgementsChecked] =
    useState(verifyAllAcknowledgementsChecked(jsonData.acknowledgements));
  const [areAllSubmissionFieldsSet, setAreAllSubmissionFieldsSet] = useState(
    verifyAllSubmissionsFilled(jsonData.submission)
  );
  const [templateData, setTemplateData] = useState(null);

  const formContext = useMemo(() => {
    const intakeCloseTimestamp =
      application?.intakeByIntakeId?.closeTimestamp ||
      openIntake?.closeTimestamp;

    return {
      intakeCloseTimestamp,
      fullFormData: jsonData,
      formSchema: jsonSchema,
      formErrorSchema,
      isEditable,
      areAllAcknowledgementsChecked,
      rowId,
      finalUiSchema,
      setTemplateData,
      isProjectAreaInvalid,
      acceptedProjectAreasArray,
      isProjectAreaSelected,
    };
  }, [
    openIntake,
    application?.intakeByIntakeId?.closeTimestamp,
    formErrorSchema,
    isEditable,
    areAllAcknowledgementsChecked,
    rowId,
    jsonSchema,
    isProjectAreaInvalid,
    acceptedProjectAreasArray,
    isProjectAreaSelected,
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

  const subschemaArray: [string, JSONSchema7][] = schemaToSubschemasArray(
    jsonSchema as object
  );

  const sectionSchema = jsonSchema.properties[sectionName] as JSONSchema7;
  const isWithdrawn = status === 'withdrawn';
  const isSubmitted = status === 'submitted';
  const isSubmitPage = sectionName === 'submission';
  const isAcknowledgementPage = sectionName === 'acknowledgements';
  const isProjectAreaPage = sectionName === 'projectArea';
  const isOtherFundingSourcesPage = sectionName === 'otherFundingSources';

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
        (noErrors || jsonData?.review?.acknowledgeIncomplete) &&
        !isSubmitted &&
        isEditable &&
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
    isEditable,
    isUpdating,
    isProjectAreaInvalid,
    isProjectAreaSelected,
  ]);

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }

  const saveForm = (
    newFormSectionData: any,
    mutationConfig?: Partial<
      UseDebouncedMutationConfig<updateApplicationFormMutation>
    >,
    isRedirectingToNextPage = false,
    isSaveAsDraftBtn = false
  ) => {
    if (!isEditable) {
      if (pageNumber < subschemaArray.length) {
        router.push(`/applicantportal/form/${rowId}/${pageNumber + 1}`);
      } else {
        router.push(`/applicantportal/form/${rowId}/success`);
      }
      return;
    }
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
    if (isProjectAreaPage) {
      const firstNationsLed = newFormSectionData?.firstNationsLed || false;
      let projectAreaAccepted =
        firstNationsLed ||
        acceptedProjectAreasArray.includes(
          newFormSectionData?.geographicArea?.[0]?.toString()
        );

      const geographicAreaInputChanged =
        typeof newFormSectionData?.geographicArea?.[0] !== 'undefined' &&
        newFormSectionData?.geographicArea[0] !==
          jsonData.projectArea?.geographicArea?.[0];
      const firstNationsLedInputChanged =
        firstNationsLed !== jsonData.projectArea?.firstNationsLed;
      const isGeographicAreaEmpty =
        newFormSectionData?.geographicArea?.[0] === 'undefined' ||
        newFormSectionData?.geographicArea?.length === 0;

      if (isSubmitted) {
        if (isGeographicAreaEmpty || !projectAreaAccepted) {
          // revert form data
          newFormData = { ...jsonData };
        }

        if (!projectAreaAccepted) {
          if (geographicAreaInputChanged) {
            // display new modal saying
            // Invalid selection. You have indicated that this project is not led or supported by First Nations, therefore, you may only choose from zones 1,2,3 or 6.
            setProjectAreaModalType('invalid-geographic-area');
          }
          if (firstNationsLedInputChanged) {
            // display modal saying
            // Invalid selection. Please first choose from zones 1,2,3 or 6 if this project is not supported or led by First Nations
            setProjectAreaModalType('first-nations-led');
          }
        } else if (!isSubmitEnabled) {
          setProjectAreaModalType('pre-submitted');
        }
      }
      setProjectAreaModalOpen(
        !projectAreaAccepted &&
          (geographicAreaInputChanged || firstNationsLedInputChanged)
      );
      projectAreaAccepted =
        firstNationsLed ||
        acceptedProjectAreasArray.includes(
          newFormData?.projectArea?.geographicArea?.[0]?.toString()
        );
      setIsProjectAreaInvalid(!projectAreaAccepted);
      setProjectAreaSelected(
        newFormData?.projectArea?.geographicArea?.length > 0
      );
    }

    if (templateData) {
      if (templateData.templateNumber === 1) {
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
      } else if (templateData.templateNumber === 2) {
        newFormData = {
          ...newFormData,
          budgetDetails: {
            ...newFormData.budgetDetails,
            totalEligibleCosts: templateData.data.result.totalEligibleCosts,
            totalProjectCost: templateData.data.result.totalProjectCosts,
          },
        };
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
          window.location.hash = 'data-out-of-sync';
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

  const handleSubmit = (e: ISubmitEvent<any>) => {
    if (pageNumber < subschemaArray.length) {
      saveForm(
        e.formData,
        {
          onCompleted: () => {
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
        onCompleted: () =>
          router.push(`/applicantportal/form/${rowId}/success`),
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
      !isEditable
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
        onSubmit={handleSubmit}
        onChange={handleChange}
        // Moved here to prevent cycle of FormBase calling the ReviewField through DefaultTheme
        fields={{ ReviewField }}
        formData={jsonData[sectionName]}
        schema={sectionSchema as JSONSchema7}
        uiSchema={finalUiSchema[sectionName]}
        // Todo: validate entire form on completion
        noValidate
        disabled={isFormDisabled()}
        formContext={formContext}
      >
        <SubmitButtons
          disabled={!isSubmitEnabled || isSubmitting}
          isEditable={isEditable}
          isUpdating={isUpdating}
          isSubmitPage={isSubmitPage}
          formData={jsonData[sectionName]}
          savedAsDraft={savedAsDraft}
          saveForm={saveForm}
          isAcknowledgementPage={isAcknowledgementPage}
          status={status}
        />
      </FormBase>
      <ConflictModal id="data-out-of-sync" />
      <ProjectAreaModal
        projectAreaModalOpen={projectAreaModalOpen}
        setProjectAreaModalOpen={setProjectAreaModalOpen}
        projectAreaModalType={projectAreaModalType}
      />
    </>
  );
};

export default ApplicationForm;
