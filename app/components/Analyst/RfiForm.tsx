import Link from 'next/link';
import { useRouter } from 'next/router';
import { ISubmitEvent } from '@rjsf/core';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import rfiUiSchema from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useCreateRfiMutation } from 'schema/mutations/application/createRfi';

const StyledCancel = styled(Button)`
  margin-left: 24px;
`;

const RfiForm = () => {
  const router = useRouter();
  const { applicationId } = router.query;
  const rfiUrl = `/analyst/application/${applicationId}/rfi`;
  const [createRfi] = useCreateRfiMutation();

  const handleSubmit = (e: ISubmitEvent<any>) => {
    console.log(e);
    createRfi({
      variables: {
        input: {
          rowId: parseInt(applicationId as string, 10),
        },
      },
      onCompleted: () => {
        router.push(rfiUrl);
      },
      onError: (err) => {
        console.log('Error creating RFI', err);
      },
    });
  };

  return (
    <div>
      <FormBase
        schema={rfiSchema}
        uiSchema={rfiUiSchema}
        formData={{}}
        onSubmit={handleSubmit}
        noValidate
      >
        <Button>Save</Button>
        <Link href={rfiUrl} passHref>
          <StyledCancel variant="secondary">Cancel</StyledCancel>
        </Link>
      </FormBase>
    </div>
  );
};

export default RfiForm;
