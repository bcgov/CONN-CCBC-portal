import FormBase from './FormBase';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import Button from '@button-inc/bcgov-theme/Button';
import type { JSONSchema7 } from 'json-schema';

interface Props {
  onSubmit: any;
  formData: any;
}

const ApplicationForm: React.FC<Props> = (props) => {
  return (
    <FormBase {...props} schema={schema as JSONSchema7} uiSchema={uiSchema}>
      <Button variant="primary" type="submit">
        Complete application
      </Button>
    </FormBase>
  );
};

export default ApplicationForm;
