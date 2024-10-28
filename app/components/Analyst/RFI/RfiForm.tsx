import Link from 'next/link';
import { useRouter } from 'next/router';
import { IChangeEvent } from '@rjsf/core';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import rfiUiSchema from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useCreateRfiMutation } from 'schema/mutations/application/createRfi';
import { graphql, useFragment } from 'react-relay';
import { RfiForm_RfiData$key } from '__generated__/RfiForm_RfiData.graphql';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import removeFalseyValuesFromObject from 'utils/removeFalseValuesFromObject';
import { useState } from 'react';
import RfiTheme from './RfiTheme';

const StyledCancel = styled(Button)`
  margin-left: 24px;
`;

interface RfiFormProps {
  rfiDataKey: RfiForm_RfiData$key;
}

const StyledH4 = styled.h4`
  margin: 24px 0 24px;
  font-weight: 700;
  font-size: 24px;
`;

const RfiForm = ({ rfiDataKey }: RfiFormProps) => {
  const router = useRouter();
  const { applicationId, rfiId } = router.query;
  const isNewRfiForm = rfiId === '0';
  const rfiFormData = useFragment<RfiForm_RfiData$key>(
    graphql`
      fragment RfiForm_RfiData on RfiData {
        rfiNumber
        jsonData
      }
    `,
    rfiDataKey
  );

  const rfiUrl = `/analyst/application/${applicationId}/rfi`;
  const [createRfi] = useCreateRfiMutation();
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [formData, setFormData] = useState(rfiFormData?.jsonData ?? {});

  const handleSubmit = (e: IChangeEvent<any>) => {
    const newFormData = {
      ...e.formData,
      rfiAdditionalFiles: {
        // Remove fields with false values from object to prevent unintended bugs when
        // a user unchecks a previously checked field.
        ...removeFalseyValuesFromObject(e.formData.rfiAdditionalFiles),
      },
    };

    if (isNewRfiForm) {
      createRfi({
        variables: {
          input: {
            applicationRowId: parseInt(applicationId as string, 10),
            jsonData: newFormData,
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
            jsonData: newFormData,
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
      {rfiFormData?.rfiNumber && <StyledH4>{rfiFormData?.rfiNumber}</StyledH4>}
      <FormBase
        theme={RfiTheme}
        schema={rfiSchema}
        uiSchema={rfiUiSchema}
        omitExtraData={false}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={handleSubmit}
        noValidate
      >
        <Button>Save</Button>
        <Link href={rfiUrl} passHref data-skip-unsaved-warning>
          <StyledCancel variant="secondary">Cancel</StyledCancel>
        </Link>
      </FormBase>
    </div>
  );
};

export default RfiForm;
