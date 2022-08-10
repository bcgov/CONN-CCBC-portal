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

interface Props {
  formData: any;
  pageNumber: number;
  trimmedSub: any;
  applicationId: number;
  status: string;
}

interface CalculatedFieldJSON {
  number1: number;
  number2: number;
  sum: number;
}

const ApplicationForm: React.FC<Props> = ({
  formData,
  pageNumber,
  trimmedSub,
  applicationId,
  status,
}) => {
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

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }

  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1];

  const review = sectionName === 'review';

  const saveForm = async (incomingFormData: any, existingFormData: any) => {
    if (status === 'withdrawn') {
      return;
    }
    const pageNumber = parseInt(router.query.page as string);
    const sectionName = subschemaArray[pageNumber - 1][0];
    let newFormData: any = {};
    if (Object.keys(existingFormData).length === 0) {
      newFormData[sectionName] = incomingFormData.formData;
    } else if (existingFormData[sectionName]) {
      newFormData = { ...existingFormData };
      newFormData[sectionName] = {
        ...existingFormData[sectionName],
        ...incomingFormData.formData,
      };
    } else {
      newFormData = { ...existingFormData };
      newFormData[sectionName] = { ...incomingFormData.formData };
    }

    const lastEditedPage =
      pageNumber < subschemaArray.length ? subschemaArray[pageNumber][0] : '';

    return await updateApplication({
      variables: {
        input: {
          applicationPatch: {
            formData: newFormData,
            // technically this is the last edited page but for now it makes more sense to
            // bring
            // lastEditedPage: sectionName,
            lastEditedPage: lastEditedPage,
          },
          rowId: applicationId,
        },
      },
    });
  };

  const handleSubmit = async (incomingFormData: any, formData: any) => {
    saveForm(incomingFormData, formData).then(() => {
      //  TODO: update rerouting logic to handle when there are form errors etc.
      if (pageNumber < subschemaArray.length) {
        router.push(`/form/${applicationId}/${pageNumber + 1}`);
      } else {
        //Does not return query from mutation
        assignCcbcId({
          variables: {
            input: {
              applicationId: applicationId,
            },
          },
        });
        router.push(`/form/${applicationId}/success`);
      }
    });
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
          onSubmit={(incomingFormData: any) => {
            handleSubmit(incomingFormData, formData);
          }}
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
          onSubmit={(incomingFormData: any) => {
            handleSubmit(incomingFormData, formData);
          }}
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
