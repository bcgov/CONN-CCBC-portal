import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import rfiUiSchema from 'formSchema/uiSchema/analyst/rfiUiSchema';

const StyledCancel = styled(Button)`
  margin-left: 24px;
`;

const RFI = () => {
  const router = useRouter();
  const { applicationId } = router.query;

  return (
    <div>
      <FormBase schema={rfiSchema} uiSchema={rfiUiSchema} formData={{}}>
        <Button>Save</Button>
        <Link href={`/analyst/application/${applicationId}/rfi`} passHref>
          <StyledCancel variant="secondary">Cancel</StyledCancel>
        </Link>
      </FormBase>
    </div>
  );
};

export default RFI;
