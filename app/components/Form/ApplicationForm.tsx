import FormBase from './FormBase';
import uiSchema from '../../formSchema/uiSchema';
import schema from '../../formSchema/schema';
import StyledGovButton from '../../components/StyledGovButton';

interface Props {
  onSubmit: () => void;
}

const ApplicationForm: React.FC<Props> = (props) => {
  return (
    <>
      <FormBase {...props} schema={schema} uiSchema={uiSchema}>
        <StyledGovButton variant="primary">Continue</StyledGovButton>
      </FormBase>
    </>
  );
};

export default ApplicationForm;
