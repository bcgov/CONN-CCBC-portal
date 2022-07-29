import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@button-inc/bcgov-theme/Button';
import type { JSONSchema7 } from 'json-schema';

import { FormBase } from '.';
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

interface Props {
  formData: any;
  pageNumber: number;
  trimmedSub: any;
  applicationId: number;
}

const ApplicationForm: React.FC<Props> = ({
  formData,
  pageNumber,
  trimmedSub,
  applicationId,
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

  const formErrorSchema = formatErrorSchema(formData, schema());

  const noErrors = Object.keys(formErrorSchema).length === 0;

  const [reviewConfirm, setReviewConfirm] = useState(false);

  const router = useRouter();
  const [updateApplication] = useUpdateApplicationMutation();
  const [assignCcbcId] = useAddCcbcIdToApplicationMutation();

  const subschemaArray = schemaToSubschemasArray(schema() as object);

  if (subschemaArray.length < pageNumber) {
    // Todo: proper 404
    return <h2>404 not found</h2>;
  }

  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1];

  const review = sectionName === 'review';

  const saveForm = async (incomingFormData: any, existingFormData: any) => {
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

    return await updateApplication({
      variables: {
        input: {
          applicationPatch: {
            formData: newFormData,
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

  return (
    <FormBase
      onSubmit={(incomingFormData: any) => {
        handleSubmit(incomingFormData, formData);
      }}
      formData={formData[sectionName]}
      schema={sectionSchema as JSONSchema7}
      uiSchema={uiSchema}
      // Todo: validate entire form on completion
      noValidate={true}
    >
      {review && (
        <Review
          formData={formData}
          formSchema={schema()}
          reviewConfirm={reviewConfirm}
          onReviewConfirm={() => setReviewConfirm(!reviewConfirm)}
          formErrorSchema={formErrorSchema}
          noErrors={noErrors}
        />
      )}
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
      {/* // Return to this save button later, will likely require a hacky solution to work
      // nice with RJSF
      <Button variant="secondary" style={{ marginLeft: '20px' }}>
        Save
      </Button> */}
    </FormBase>
  );
};
export default ApplicationForm;
