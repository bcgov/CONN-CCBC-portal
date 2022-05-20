import FormBase from './FormBase';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import { updateApplicationMutation } from '../../schema/mutations';
import StyledGovButton from '../../components/StyledGovButton';
import type { JSONSchema7 } from 'json-schema';
import { schemaToSubschemasArray } from '../../utils/schemaUtils';
import { useRouter } from 'next/router';

interface Props {
  formData: any;
  pageNumber: number;
}

const ApplicationForm: React.FC<Props> = ({ formData, pageNumber }) => {
  const router = useRouter();

  const subschemaArray = schemaToSubschemasArray(schema as JSONSchema7)
  const [sectionName, sectionSchema] = subschemaArray[pageNumber - 1]


  const saveForm = async (incomingFormData: any, existingFormData: any) => {
    const pageNumber = parseInt(router.query.page as string)
    const sectionName = subschemaArray[pageNumber - 1][0]
    let newFormData: any = {};

    if (Object.keys(existingFormData).length === 0) {
      newFormData['contactInformation'] = incomingFormData.formData
    }
    else if (existingFormData[sectionName]) {
      newFormData = { ...existingFormData }
      newFormData[sectionName] = { ...existingFormData[sectionName], ...incomingFormData.formData }
    }
    else {
      newFormData = { ...existingFormData }
      newFormData[sectionName] = { ...incomingFormData.formData }
    }
    await updateApplicationMutation({
      owner: '74d2515660e6444ca177a96e67ecfc5f',
      formData: newFormData,
      // change status? Consider having an "editing" status or something, and switching to complete
      // when the form actually getts finished.
      status: 'complete',
    }).then(() => {
      //  TODO: update rerouting logic to handle when there are form errors etc.
      if (pageNumber < subschemaArray.length) router.push(`/form/${pageNumber + 1}`);
      else router.push('/form/success');
    })
  }

  return (
    <FormBase formData={formData[sectionName]} onSubmit={(incomingFormData: any) => saveForm(incomingFormData, formData)} schema={sectionSchema as JSONSchema7} uiSchema={uiSchema}>
      <StyledGovButton variant="primary" type="submit">
        Continue
      </StyledGovButton>
    </FormBase>
  );
}
export default ApplicationForm;
