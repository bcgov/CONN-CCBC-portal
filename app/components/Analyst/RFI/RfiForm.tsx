import Link from 'next/link';
import { useRouter } from 'next/router';
import { ISubmitEvent } from '@rjsf/core';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import rfiUiSchema from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useCreateRfiMutation } from 'schema/mutations/application/createRfi';
import { graphql, useFragment } from 'react-relay';
import { RfiForm_RfiData$key } from '__generated__/RfiForm_RfiData.graphql';
import { useUpdateRfiMutation } from 'schema/mutations/application/updateRfi';
import RfiTheme from './RfiTheme';

const StyledCancel = styled(Button)`
  margin-left: 24px;
`;

interface RfiFormProps {
  rfiDataKey: RfiForm_RfiData$key;
}

const RfiForm = ({ rfiDataKey }: RfiFormProps) => {
  const router = useRouter();
  const { applicationId, rfiId } = router.query;
  const rfiFormData = useFragment<RfiForm_RfiData$key>(
    graphql`
      fragment RfiForm_RfiData on RfiData {
        jsonData
      }
    `,
    rfiDataKey
  );
  const rfiUrl = `/analyst/application/${applicationId}/rfi`;
  const [createRfi] = useCreateRfiMutation();
  const [updateRfi] = useUpdateRfiMutation();

  const handleSubmit = (e: ISubmitEvent<any>) => {
    if (rfiId === '0') {
      createRfi({
        variables: {
          input: {
            applicationRowId: parseInt(applicationId as string, 10),
            jsonData: e.formData,
          },
        },
        onCompleted: () => {
          router.push(rfiUrl);
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error creating RFI', err);
        },
      });
    } else {
      updateRfi({
        variables: {
          input: {
            jsonData: e.formData,
            rfiRowId: parseInt(rfiId as string, 10),
          },
        },
        onCompleted: () => {
          router.push(rfiUrl);
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error updating RFI', err);
        },
      });
    }
  };

  return (
    <div>
      <FormBase
        theme={RfiTheme}
        schema={rfiSchema}
        uiSchema={rfiUiSchema}
        omitExtraData={false}
        formData={rfiFormData?.jsonData ?? {}}
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
