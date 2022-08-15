import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@button-inc/bcgov-theme/Button';
import type { JSONSchema7 } from 'json-schema';
import { CalculationForm, FormBase } from '.';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import { schemaToSubschemasArray } from '../../utils/schemaUtils';
import { Review } from '../Review';
import { acknowledgements } from '../../formSchema/pages';

const NUM_ACKNOWLEDGEMENTS =
  acknowledgements.acknowledgements.properties.acknowledgementsList.items.enum
    .length;

// https://github.com/rjsf-team/react-jsonschema-form/issues/2131
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import validateFormData from '@rjsf/core/dist/cjs/validate';
import { useAddCcbcIdToApplicationMutation } from '../../schema/mutations/application/addCcbcIdToApplication';
import {
  calculateProjectEmployment,
  calculateContractorEmployment,
} from '../../lib/theme/customFieldCalculations';
import { IChangeEvent, ISubmitEvent } from '@rjsf/core';
import { graphql, useFragment } from 'react-relay';
import { ApplicationForm_application$key } from '__generated__/ApplicationForm_application.graphql';
import { useUpdateApplicationMutation } from 'schema/mutations/application/updateApplication';
import { UseDebouncedMutationConfig } from 'schema/mutations/useDebouncedMutation';
import { updateApplicationMutation } from '__generated__/updateApplicationMutation.graphql';
import ApplicationFormStatus from './ApplicationFormStatus';
import styled from 'styled-components';

const customPages = [
  'estimatedProjectEmployment',
  'acknowledgements',
  'submission',
];


const formatErrorSchema = (formData, schema) => {
  const errorSchema = validateFormData(formData, schema)?.errorSchema;

  // Remove declarations errors from error schema since they aren't on review page
  delete errorSchema['acknowledgements'];
  delete errorSchema['submission'];

  // This is a workaround for 'should be array' error and the schema/radio widget
  // should ideally be refactored so we don't need this.
  const arrayError =
    errorSchema?.organizationProfile?.typeOfOrganization?.__errors[0] ===
    'should be array';
  if (arrayError && Object.keys(errorSchema.organizationProfile).length <= 1) {
    delete errorSchema['organizationProfile'];
  }

  return errorSchema;
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

const Flex = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

interface Props {
  pageNumber: number;
  application: ApplicationForm_application$key;
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
}) => {
  const application = useFragment(
    graphql`
      fragment ApplicationForm_application on Application {
        id
        rowId
        formData
        status
        ...ApplicationFormStatus_application
      }
    `,
    applicationKey
  );
  const { id, rowId, formData, status } = application;

  const formErrorSchema = formatErrorSchema(formData, schema(formData));

  const noErrors = Object.keys(formErrorSchema).length === 0;

  const [reviewConfirm, setReviewConfirm] = useState(false);
  const [savingError, setSavingError] = useState(null);
  const [areAllAcknowledgementsChecked, setAreAllacknowledgementsChecked] =
    useState(verifyAllAcknowledgementsChecked(formData['acknowledgements']));
  const [areAllSubmissionFieldsSet, setAreAllSubmissionFieldsSet] = useState(
    verifyAllSubmissionsFilled(formData['submission'])
  );

  const router = useRouter();
  const [assignCcbcId] = useAddCcbcIdToApplicationMutation();
  const [updateApplication, isUpdating] = useUpdateApplicationMutation();

  const subschemaArray: [string, JSONSchema7][] = schemaToSubschemasArray(
    schema(formData) as object
  );

  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1];

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }
  const review = sectionName === 'review';

  const saveForm = (
    newFormSectionData: object,
    mutationConfig?: Partial<
      UseDebouncedMutationConfig<updateApplicationMutation>
    >,
    isRedirectingToNextPage = false
  ) => {
    if (status === 'withdrawn') {
      return;
    }

    let newFormData: Record<string, object> = {};
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

    setSavingError(null);
    updateApplication({
      variables: {
        input: {
          applicationPatch: {
            formData: newFormData,
            lastEditedPage: lastEditedPage,
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
      ...mutationConfig,
    });
  };

  const handleSubmit = (e: ISubmitEvent<any>) => {
    saveForm(
      e.formData,
      {
        onCompleted: () => {
          //  TODO: update rerouting logic to handle when there are form errors etc.
          if (pageNumber < subschemaArray.length) {
            router.push(`/form/${rowId}/${pageNumber + 1}`);
          } else {
            //Does not return query from mutation
            assignCcbcId({
              variables: {
                input: {
                  applicationId: rowId,
                },
              },
            });
            router.push(`/form/${rowId}/success`);
          }
        },
      },
      true
    );
  };

  const handleChange = (e: IChangeEvent<any>) => {
    saveForm(e.formData);
  };

  const handleDisabled = (page: string, noErrors: boolean) => {
    let disabled = false;
    switch (true) {
      case page === 'review' && noErrors:
        disabled = false;
        break;
      case page === 'review':
        disabled = !reviewConfirm;
        break;
      case page === 'acknowledgements':
        disabled = !areAllAcknowledgementsChecked;
        break;
      case page === 'submission':
        disabled = !areAllSubmissionFieldsSet;
        break;
    }
    return disabled;
  };

  const calculate = (formData) => {
    formData = {
      ...formData,
      ...(sectionName === 'estimatedProjectEmployment' && {
        ...calculateProjectEmployment(formData),
        ...calculateContractorEmployment(formData),
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

  const submitBtns = (
    <>
      <Button
        variant="primary"
        disabled={handleDisabled(sectionName, noErrors)}
      >
        {pageNumber < subschemaArray.length ? 'Continue' : 'Submit'}
      </Button>
    </>
  );

  const customPagesDict = {
    estimatedProjectEmployment: (
      <CalculationForm
        // Facing rendering issues, key here to allow react to identify a new component
        key="estimatedProjectEmployment"
        onSubmit={handleSubmit}
        onCalculate={(formData: CalculatedFieldJSON) => calculate(formData)}
        formData={formData[sectionName]}
        schema={sectionSchema as JSONSchema7}
        uiSchema={uiSchema}
        // Todo: validate entire form on completion
        noValidate={true}
        disabled={status === 'withdrawn'}
      >
        {submitBtns}
      </CalculationForm>
    ),
    acknowledgements: (
      <CalculationForm
        key="acknowledgements"
        onSubmit={handleSubmit}
        onCalculate={updateAreAllAcknowledgementFieldsSet}
        formData={formData[sectionName]}
        schema={sectionSchema as JSONSchema7}
        uiSchema={uiSchema}
        // Todo: validate entire form on completion
        noValidate={true}
        disabled={status === 'withdrawn'}
      >
        {submitBtns}
      </CalculationForm>
    ),
    submission: (
      <CalculationForm
        key="submission"
        onSubmit={handleSubmit}
        onCalculate={updateAreAllSubmissionFieldsSet}
        formData={formData[sectionName]}
        schema={sectionSchema as JSONSchema7}
        uiSchema={uiSchema}
        // Todo: validate entire form on completion
        noValidate={true}
        disabled={status === 'withdrawn'}
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
          uiSchema={uiSchema}
          // Todo: validate entire form on completion
          noValidate={true}
          disabled={status === 'withdrawn'}
        >
          {review && (
            <Review
              formData={formData}
              formSchema={schema(formData)}
              reviewConfirm={reviewConfirm}
              onReviewConfirm={() => setReviewConfirm(!reviewConfirm)}
              formErrorSchema={formErrorSchema}
              noErrors={noErrors}
            />
          )}
          {submitBtns}
        </FormBase>
      )}
    </>
  );
};

export default ApplicationForm;
