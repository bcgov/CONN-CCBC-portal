import { Button } from '@button-inc/bcgov-theme';
import { ISubmitEvent } from '@rjsf/core';
import { FormDiv } from 'components';
import { RfiTheme } from 'components/Analyst/RFI';
import { RfiFormStatus, FormBase } from 'components/Form';
import { rfiSchema } from 'formSchema/analyst';
import { rfiApplicantUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useRouter } from 'next/router';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import styled from 'styled-components';

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const RfiAnalystUpload = ({ rfiQuery }) => {
  // const query = usePreloadedQuery(rfiQuery, preloadedQuery);
  const { rfiDataByRowId, applicationByRowId } = rfiQuery;
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const router = useRouter();

  const handleSubmit = (e: ISubmitEvent<any>) => {
    updateRfi({
      variables: {
        input: {
          jsonData: e.formData,
          rfiRowId: rfiDataByRowId.rowId,
        },
      },
      onCompleted: (response) => {
        router.push(
          `/applicantportal/form/${router.query.id}/rfi/${response.updateRfi.rfiData.rowId}`
        );
      },
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.log('Error updating RFI', err);
      },
    });
  };

  return (
    <div>
      <Flex>
        <div>
          <h2>Upload new files</h2>
          {rfiDataByRowId?.jsonData.rfiDueBy && (
            <p>
              Please upload the following files by{' '}
              {rfiDataByRowId?.jsonData.rfiDueBy}
            </p>
          )}
        </div>
        <RfiFormStatus application={applicationByRowId} isSaving={false} />
      </Flex>
      <FormDiv>
        <FormBase
          theme={RfiTheme}
          schema={rfiSchema}
          uiSchema={rfiApplicantUiSchema}
          omitExtraData={false}
          formData={rfiDataByRowId?.jsonData}
          onSubmit={handleSubmit}
          noValidate
        >
          <Button>Save</Button>
        </FormBase>
      </FormDiv>
    </div>
  );
};

export default RfiAnalystUpload;
