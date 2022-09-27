import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { IChangeEvent, ISubmitEvent } from '@rjsf/core';
import { graphql, useFragment } from 'react-relay';
import type { JSONSchema7 } from 'json-schema';
import styled from 'styled-components';
import { CalculationForm, FormBase, SubmitButtons } from '.';
import { validate, schema, uiSchema } from 'formSchema';
import { acknowledgements } from 'formSchema/pages';
import { schemaToSubschemasArray } from '../../utils/schemaUtils';
import ApplicationFormStatus from './ApplicationFormStatus';
import {
  calculateApplicantFunding,
  calculateContractorEmployment,
  calculateFundingPartner,
  calculateFundingRequestedCCBC,
  calculateInfrastructureFunding,
  calculateProjectEmployment,
} from '../../lib/theme/customFieldCalculations';
import { dateTimeFormat } from '../../lib/theme/functions/formatDates';
import { ApplicationForm_application$key } from '__generated__/ApplicationForm_application.graphql';
import { useUpdateApplicationMutation } from 'schema/mutations/application/updateApplication';
import { UseDebouncedMutationConfig } from 'schema/mutations/useDebouncedMutation';
import { updateApplicationMutation } from '__generated__/updateApplicationMutation.graphql';
import { ApplicationForm_query$key } from '__generated__/ApplicationForm_query.graphql';
import { SubmissionDescriptionField } from 'lib/theme/fields';
import { useSubmitApplicationMutation } from 'schema/mutations/application/submitApplication';

const NUM_ACKNOWLEDGEMENTS = (
  (
    acknowledgements.acknowledgements.properties
      .acknowledgementsList as JSONSchema7
  ).items as JSONSchema7
).enum.length;

const customPages = [
  'acknowledgements',
  'estimatedProjectEmployment',
  'projectFunding',
  'otherFundingSources',
  'submission',
];

const CUSTOM_SUBMISSION_FIELD = {
  SubmissionField: SubmissionDescriptionField,
};

const verifyAllSubmissionsFilled = (formData?: SubmissionFieldsJSON) => {
  const isSubmissionCompletedByFilled =
    formData?.submissionCompletedBy !== undefined &&
    formData?.submissionCompletedBy.length > 0;
  const isSubmissionCompletedForFilled =
    formData?.submissionCompletedFor !== undefined &&
    formData?.submissionCompletedFor.length > 0;
  const isSubmissionDateFilled =
    formData?.submissionDate !== undefined &&
    formData?.submissionDate.length > 0;
  const isSubmissionTitleFilled =
    formData?.submissionTitle !== undefined &&
    formData?.submissionTitle.length > 0;

  return (
    isSubmissionCompletedByFilled &&
    isSubmissionCompletedForFilled &&
    isSubmissionDateFilled &&
    isSubmissionTitleFilled
  );
};

const verifyAllAcknowledgementsChecked = (
  formData?: AcknowledgementsFieldJSON
) => formData?.acknowledgementsList?.length === NUM_ACKNOWLEDGEMENTS;

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

interface CalculatedFieldJSON {
  number1: number;
  number2: number;
  sum: number;
}

const ApplicationForm: React.FC<Props> = ({
  pageNumber,
  application: applicationKey,
  query,
}) => {
  const application = useFragment(
    graphql`
      fragment ApplicationForm_application on Application {
        id
        rowId
        formData
        status
        updatedAt
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
  const { id, rowId, formData, status, updatedAt } = application;

  const formErrorSchema = useMemo(() => validate(formData), [formData]);
  const formContext = useMemo(() => {
    const intakeCloseTimestamp =
      application.status === 'submitted'
        ? application.intakeByIntakeId?.closeTimestamp
        : openIntake?.closeTimestamp;
    return {
      intakeCloseTimestamp,
      fullFormData: formData,
      formErrorSchema,
    };
  }, [
    openIntake,
    application.status,
    application.intakeByIntakeId?.closeTimestamp,
    formData,
    formErrorSchema,
  ]);

  const noErrors = Object.keys(formErrorSchema).length === 0;

  const [savingError, setSavingError] = useState(null);
  const [savedAsDraft, setSavedAsDraft] = useState(false);

  const [areAllAcknowledgementsChecked, setAreAllacknowledgementsChecked] =
    useState(verifyAllAcknowledgementsChecked(formData['acknowledgements']));
  const [areAllSubmissionFieldsSet, setAreAllSubmissionFieldsSet] = useState(
    verifyAllSubmissionsFilled(formData['submission'])
  );

  const router = useRouter();
  const [submitApplication, isSubmitting] = useSubmitApplicationMutation();
  const [updateApplication, isUpdating] = useUpdateApplicationMutation();

  const subschemaArray: [string, JSONSchema7][] = schemaToSubschemasArray(
    schema as object
  );

  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1];
  const isWithdrawn = status === 'withdrawn';
  const isDraft = status === 'draft';
  const isSubmitted = status === 'submitted';

  const isSubmitEnabled = useMemo(() => {
    if (isWithdrawn) return false;

    if (sectionName === 'review')
      return noErrors || formData.review?.acknowledgeIncomplete;

    if (sectionName === 'acknowledgements')
      return areAllAcknowledgementsChecked || isSubmitted;

    if (sectionName === 'submission')
      return (
        areAllSubmissionFieldsSet &&
        areAllAcknowledgementsChecked &&
        !isSubmitted
      );

    return true;
  }, [
    sectionName,
    noErrors,
    areAllAcknowledgementsChecked,
    areAllSubmissionFieldsSet,
    isWithdrawn,
    formData,
    isSubmitted,
  ]);

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }

  const saveForm = (
    newFormSectionData: object,
    mutationConfig?: Partial<
      UseDebouncedMutationConfig<updateApplicationMutation>
    >,
    isRedirectingToNextPage = false,
    isSaveAsDraftBtn = false
  ) => {
    if (isWithdrawn) {
      if (pageNumber < subschemaArray.length) {
        router.push(`/form/${rowId}/${pageNumber + 1}`);
      } else {
        router.push(`/form/${rowId}/success`);
      }
      return;
    }

    let newFormData: Record<string, any> = {};
    if (Object.keys(formData).length === 0) {
      newFormData[sectionName] = newFormSectionData;
    } else if (formData[sectionName]) {
      newFormData = { ...formData };
      newFormData[sectionName] = {
        ...formData[sectionName],
        ...newFormSectionData,
      };
    } else {
      newFormData = { ...formData };
      newFormData[sectionName] = { ...newFormSectionData };
    }

    // if we're redirecting after this, set lastEditedPage to the next page
    const lastEditedPageNumber = isRedirectingToNextPage
      ? pageNumber
      : pageNumber - 1;
    const lastEditedPage =
      pageNumber < subschemaArray.length
        ? subschemaArray[lastEditedPageNumber][0]
        : '';

    if (isDraft) {
      // Auto fill submission fields
      newFormData = {
        ...newFormData,
        submission: {
          ...newFormData.submission,
          submissionCompletedFor:
            newFormData?.organizationProfile?.organizationName,
          submissionDate: dateTimeFormat(
            new Date(updatedAt),
            'date_year_first'
          ),
        },
      };
    }

    setSavingError(null);
    updateApplication({
      variables: {
        input: {
          applicationPatch: {
            formData: newFormData,
            lastEditedPage: isSaveAsDraftBtn ? 'review' : lastEditedPage,
          },
          id,
        },
      },
      optimisticResponse: {
        updateApplication: {
          application: {
            id,
            formData: newFormData,
            updatedAt: undefined,
          },
        },
      },
      debounceKey: id,
      onError: () => {
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
            router.push(`/form/${rowId}/${pageNumber + 1}`);
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
        onCompleted: () => router.push(`/form/${rowId}/success`),
      });
    }
  };

  const handleChange = (e: IChangeEvent<any>) => {
    setSavedAsDraft(false);
    saveForm(e.formData);
  };

  const calculate = (formData) => {
    formData = {
      ...formData,
      ...(sectionName === 'estimatedProjectEmployment' && {
        ...calculateProjectEmployment(formData),
        ...calculateContractorEmployment(formData),
      }),
      ...(sectionName === 'projectFunding' && {
        ...calculateFundingRequestedCCBC(formData),
        ...calculateApplicantFunding(formData),
      }),
      ...(sectionName === 'otherFundingSources' && {
        ...calculateInfrastructureFunding(formData),
        ...calculateFundingPartner(formData),
      }),
    };
    return formData;
  };

  const updateAreAllSubmissionFieldsSet = (formData: SubmissionFieldsJSON) => {
    setAreAllSubmissionFieldsSet(verifyAllSubmissionsFilled(formData));

    return formData;
  };

  const updateAreAllAcknowledgementFieldsSet = (
    formData: AcknowledgementsFieldJSON
  ) => {
    setAreAllacknowledgementsChecked(
      verifyAllAcknowledgementsChecked(formData)
    );

    return formData;
  };

  const isCustomPage = customPages.includes(sectionName);
  const isSubmitPage = pageNumber >= subschemaArray.length;
  const isAcknowledgementPage = sectionName === 'acknowledgements';

  const submitBtns = (
    <SubmitButtons
      disabled={!isSubmitEnabled || isSubmitting}
      isUpdating={isUpdating}
      isSubmitPage={isSubmitPage}
      formData={formData}
      savedAsDraft={savedAsDraft}
      saveForm={saveForm}
      isAcknowledgementPage={isAcknowledgementPage}
      status={status}
    />
  );

  const isFormDisabled = () => {
    const isAcknowledgementOrSubmissionPage =
      sectionName === 'acknowledgements' || sectionName === 'submission';

    return isWithdrawn || (isSubmitted && isAcknowledgementOrSubmissionPage);
  };

  const customPagesDict = {
    acknowledgements: (
      <CalculationForm
        key="acknowledgements"
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCalculate={updateAreAllAcknowledgementFieldsSet}
        formData={formData[sectionName]}
        schema={sectionSchema}
        uiSchema={uiSchema[sectionName]}
        noValidate={true}
        disabled={isFormDisabled()}
      >
        {submitBtns}
      </CalculationForm>
    ),
    estimatedProjectEmployment: (
      <CalculationForm
        // Facing rendering issues, key here to allow react to identify a new component
        key="estimatedProjectEmployment"
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCalculate={(formData: CalculatedFieldJSON) => calculate(formData)}
        formData={formData[sectionName]}
        schema={sectionSchema}
        uiSchema={uiSchema[sectionName]}
        noValidate={true}
        disabled={isFormDisabled()}
      >
        {submitBtns}
      </CalculationForm>
    ),
    otherFundingSources: (
      <CalculationForm
        key="otherFundingSources"
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCalculate={(formData: CalculatedFieldJSON) => calculate(formData)}
        formData={formData[sectionName]}
        schema={sectionSchema}
        uiSchema={uiSchema[sectionName]}
        noValidate={true}
        disabled={isWithdrawn}
      >
        {submitBtns}
      </CalculationForm>
    ),
    projectFunding: (
      <CalculationForm
        key="projectFunding"
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCalculate={(formData: CalculatedFieldJSON) => calculate(formData)}
        formData={formData[sectionName]}
        schema={sectionSchema}
        fields={CUSTOM_SUBMISSION_FIELD}
        uiSchema={uiSchema[sectionName]}
        formContext={formContext}
        noValidate={true}
        disabled={isFormDisabled()}
      >
        {submitBtns}
      </CalculationForm>
    ),
    submission: (
      <CalculationForm
        key="submission"
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCalculate={updateAreAllSubmissionFieldsSet}
        formData={formData[sectionName]}
        schema={sectionSchema}
        uiSchema={uiSchema[sectionName]}
        fields={CUSTOM_SUBMISSION_FIELD}
        formContext={formContext}
        noValidate={true}
        disabled={isFormDisabled()}
      >
        {submitBtns}
      </CalculationForm>
    ),
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
      {isCustomPage ? (
        customPagesDict[sectionName]
      ) : (
        <FormBase
          onSubmit={handleSubmit}
          onChange={handleChange}
          formData={formData[sectionName]}
          schema={sectionSchema as JSONSchema7}
          uiSchema={uiSchema[sectionName]}
          // Todo: validate entire form on completion
          noValidate={true}
          disabled={isFormDisabled()}
          formContext={formContext}
        >
          {submitBtns}
        </FormBase>
      )}
    </>
  );
};

export default ApplicationForm;
