import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@button-inc/bcgov-theme/Button';
import type { JSONSchema7 } from 'json-schema';
import { CalculationForm, FormBase } from '.';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import { useUpdateApplicationMutation } from '../../schema/mutations/application/updateApplication';
import { schemaToSubschemasArray } from '../../utils/schemaUtils';
import { Review } from '../Review';

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

interface Props {
  pageNumber: number;
  trimmedSub: any;
  application: ApplicationForm_application$key;
}

interface CalculatedFieldJSON {
  number1: number;
  number2: number;
  sum: number;
}

const ApplicationForm: React.FC<Props> = ({
  pageNumber,
  trimmedSub,
  application,
}) => {
  const { id, rowId, formData, status } = useFragment(
    graphql`
      fragment ApplicationForm_application on Application {
        id
        rowId
        formData
        status
      }
    `,
    application
  );

  const formatErrorSchema = (formData, schema) => {
    const errorSchema = validateFormData(formData, schema)?.errorSchema;

    // Remove declarations errors from error schema since they aren't on review page
    delete errorSchema['declarations'];
    delete errorSchema['declarationsSign'];

    // This is a workaround for 'should be array' error and the schema/radio widget
    // should ideally be refactored so we don't need this.
    const arrayError =
      errorSchema?.organizationProfile?.typeOfOrganization?.__errors[0] ===
      'should be array';
    if (
      arrayError &&
      Object.keys(errorSchema.organizationProfile).length <= 1
    ) {
      delete errorSchema['organizationProfile'];
    }

    return errorSchema;
  };

  const formErrorSchema = formatErrorSchema(formData, schema(formData));

  const noErrors = Object.keys(formErrorSchema).length === 0;

  const [reviewConfirm, setReviewConfirm] = useState(false);

  const router = useRouter();
  const [updateApplication] = useUpdateApplicationMutation();
  const [assignCcbcId] = useAddCcbcIdToApplicationMutation();

  const subschemaArray = schemaToSubschemasArray(schema(formData) as object);

  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1];

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }
  const review = sectionName === 'review';

  const saveForm = async (newFormSectionData: object) => {
    console.log('saving');
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

    const lastEditedPage =
      pageNumber < subschemaArray.length ? subschemaArray[pageNumber][0] : '';

    await updateApplication({
      variables: {
        input: {
          applicationPatch: {
            formData: newFormData,
            // technically this is the last edited page but for now it makes more sense to
            // bring
            // lastEditedPage: sectionName,
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
          },
        },
      },
      debounceKey: id,
    });
    console.log('saved');
  };

  const handleSubmit = async (e: ISubmitEvent<any>) => {
    await saveForm(e.formData);

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

  const isCalculatedPage = sectionName === 'estimatedProjectEmployment';

  const submitBtns = (
    <>
      {pageNumber < subschemaArray.length ? (
        <Button
          variant="primary"
          disabled={handleDisabled(sectionName, noErrors)}
        >
          Continue
        </Button>
      ) : (
        <Button variant="primary">Submit</Button>
      )}
    </>
  );

  return (
    <>
      {isCalculatedPage ? (
        <CalculationForm
          onSubmit={handleSubmit}
          onChange={handleChange}
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
