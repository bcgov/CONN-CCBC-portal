import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { IChangeEvent, ISubmitEvent } from '@rjsf/core';
import { graphql, useFragment } from 'react-relay';
import type { JSONSchema7 } from 'json-schema';
import styled from 'styled-components';
import validate from 'formSchema/validate';
import schema from 'formSchema/schema';
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
  getSectionNameFromPageNumber,
  schemaToSubschemasArray,
} from '../../utils/schemaUtils';
import ConflictModal from './ConflictModal';

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
  calculatedSection
) => {
  const schemaSection = schema.properties[formSectionName];

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
            jsonSchema
          }
        }
        status
        intakeByIntakeId {
          closeTimestamp
        }
        ...ApplicationFormStatus_application
      }
    `,
    applicationKey
  );

  const { openIntake } = useFragment(
    graphql`
      fragment ApplicationForm_query on Query {
        openIntake {
          closeTimestamp
        }
      }
    `,
    query
  );
  const {
    rowId,
    formData: {
      jsonData,
      rowId: formDataRowId,
      id: formDataId,
      isEditable,
      formByFormSchemaId: { jsonSchema },
      updatedAt,
    },
    status,
  } = application;

  const formErrorSchema = useMemo(() => validate(jsonData), [jsonData]);
  const sectionName = getSectionNameFromPageNumber(pageNumber);

  const noErrors = Object.keys(formErrorSchema).length === 0;

  const [savingError, setSavingError] = useState(null);
  const [savedAsDraft, setSavedAsDraft] = useState(false);

  const [areAllAcknowledgementsChecked, setAreAllacknowledgementsChecked] =
    useState(verifyAllAcknowledgementsChecked(jsonData.acknowledgements));
  const [areAllSubmissionFieldsSet, setAreAllSubmissionFieldsSet] = useState(
    verifyAllSubmissionsFilled(jsonData.submission)
  );

  const formContext = useMemo(() => {
    const intakeCloseTimestamp =
      application?.intakeByIntakeId?.closeTimestamp ||
      openIntake?.closeTimestamp;

    return {
      intakeCloseTimestamp,
      fullFormData: jsonData,
      formErrorSchema,
      isEditable,
      areAllAcknowledgementsChecked,
      rowId,
    };
  }, [
    openIntake,
    application?.intakeByIntakeId?.closeTimestamp,
    jsonData,
    formErrorSchema,
    isEditable,
    areAllAcknowledgementsChecked,
    rowId,
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

  const sectionSchema = schema.properties[sectionName] as JSONSchema7;
  const isWithdrawn = status === 'withdrawn';
  const isSubmitted = status === 'submitted';
  const isSubmitPage = sectionName === 'submission';
  const isAcknowledgementPage = sectionName === 'acknowledgements';

  const isSubmitEnabled = useMemo(() => {
    if (isWithdrawn) return false;

    if (sectionName === 'review')
      return noErrors || jsonData.review?.acknowledgeIncomplete;

    if (sectionName === 'acknowledgements')
      return areAllAcknowledgementsChecked || isSubmitted;

    if (sectionName === 'submission')
      return (
        areAllSubmissionFieldsSet &&
        areAllAcknowledgementsChecked &&
        !isSubmitted &&
        isEditable
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

    if (isAcknowledgementPage)
      updateAreAllAcknowledgementFieldsSet(newFormSectionData);
    if (isSubmitPage) updateAreAllSubmissionFieldsSet(newFormSectionData);

    const calculatedSectionData = calculate(newFormSectionData, sectionName);

    const newFormData = mergeFormSectionData(
      jsonData,
      sectionName,
      calculatedSectionData
    );

    // if we're redirecting after this, set lastEditedPage to the next page
    const lastEditedPageNumber = isRedirectingToNextPage
      ? pageNumber
      : pageNumber - 1;
    const lastEditedPage =
      pageNumber < subschemaArray.length
        ? subschemaArray[lastEditedPageNumber][0]
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
        Sentry.captureException({
          name: 'Application form data is out of sync',
          message: error,
        });
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
        uiSchema={uiSchema[sectionName]}
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
    </>
  );
};

export default ApplicationForm;
