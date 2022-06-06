import { FormBase } from '.';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import { useUpdateApplicationMutation } from '../../schema/mutations/application/updateApplication';
import { useFeature } from '@growthbook/growthbook-react';

import Button from '@button-inc/bcgov-theme/Button';
import type { JSONSchema7 } from 'json-schema';
import { schemaToSubschemasArray } from '../../utils/schemaUtils';
import { useRouter } from 'next/router';

interface Props {
  formData: any;
  pageNumber: number;
  trimmedSub: any;
}

const ApplicationForm: React.FC<Props> = ({
  formData,
  pageNumber,
  trimmedSub,
}) => {
  const router = useRouter();
  const [updateApplication] = useUpdateApplicationMutation();

  // Check if development form is enabled in growthbook and pass to schema
  const formDevelopment = useFeature('form-development').value;

  const subschemaArray = schemaToSubschemasArray(
    schema(formDevelopment) as object
  );
  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1];

  const saveForm = async (incomingFormData: any, existingFormData: any) => {
    const pageNumber = parseInt(router.query.page as string);
    const sectionName = subschemaArray[pageNumber - 1][0];
    let newFormData: any = {};
    if (Object.keys(existingFormData).length === 0) {
      newFormData['contactInformation'] = incomingFormData.formData;
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
            status: 'draft',
          },
          owner: trimmedSub,
        },
      },
    });
  };

  const handleSubmit = async (incomingFormData: any, formData: any) => {
    saveForm(incomingFormData, formData).then(() => {
      //  TODO: update rerouting logic to handle when there are form errors etc.
      if (pageNumber < subschemaArray.length) {
        router.push(`/form/${pageNumber + 1}`);
      } else {
        router.push('/form/success');
      }
    });
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
      {pageNumber < subschemaArray.length ? (
        <Button variant="primary">Continue</Button>
      ) : (
        <Button variant="primary">Complete form</Button>
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
