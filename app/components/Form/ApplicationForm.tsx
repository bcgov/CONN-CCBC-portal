import FormBase from './FormBase';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import StyledGovButton from '../../components/StyledGovButton';
import type { JSONSchema7 } from 'json-schema';
import { schemaToSubschemasArray } from '../../utils/schemaUtils';

interface Props {
  onSubmit: any;
  formData: any;
  pageNumber: number;
}
const schemaArray = schemaToSubschemasArray(schema as JSONSchema7)

const ApplicationForm: React.FC<Props> = (props) => {
  const schemaArray = schemaToSubschemasArray(schema as JSONSchema7)
  // pages are indexed from 1
  const subSchema = schemaArray[props.pageNumber - 1][1]
  return (
    <FormBase {...props} schema={subSchema as JSONSchema7} uiSchema={uiSchema}>
      <StyledGovButton variant="primary" type="submit">
        Continue
      </StyledGovButton>
    </FormBase>
  );
}
export default ApplicationForm;
