import FormBase from './FormBase';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import StyledGovButton from '../../components/StyledGovButton';
import type { JSONSchema7 } from 'json-schema';

interface Props {
  onSubmit: () => void;
}

const ApplicationForm: React.FC<Props> = (props) => {
  return (
    <>
      <FormBase {...props} schema={schema as JSONSchema7} uiSchema={uiSchema}>
        <StyledGovButton variant="primary" type="submit">
          Continue
        </StyledGovButton>
      </FormBase>
    </>
  );
};

export default ApplicationForm;
