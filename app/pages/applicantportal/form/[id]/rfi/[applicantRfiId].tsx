import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { ApplicantRfiIdQuery } from '__generated__/ApplicantRfiIdQuery.graphql';
import { FormBase, RfiFormStatus } from 'components/Form';
import { RfiTheme } from 'components/Analyst/RFI';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import { rfiApplicantUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { Button } from '@button-inc/bcgov-theme';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import { ISubmitEvent } from '@rjsf/core';
import { useRouter } from 'next/router';
import FormDiv from 'components/FormDiv';
import styled from 'styled-components';

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const getApplicantRfiIdQuery = graphql`
  query ApplicantRfiIdQuery($applicationId: Int!, $rfiId: Int!) {
    rfiDataByRowId(rowId: $rfiId) {
      ...RfiForm_RfiData
      jsonData
      rowId
      id
    }
    session {
      sub
    }
    applicationByRowId(rowId: $applicationId) {
      ...RfiFormStatus_application
      id
    }
  }
`;

const ApplicantRfiPage = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, ApplicantRfiIdQuery>) => {
  const query = usePreloadedQuery(getApplicantRfiIdQuery, preloadedQuery);
  const { session, rfiDataByRowId, applicationByRowId } = query;
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
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <Flex>
          <h2>RFI</h2>
          <RfiFormStatus application={applicationByRowId} isSaving={false} />
        </Flex>
        <FormDiv>
          <FormBase
            theme={RfiTheme}
            schema={rfiSchema}
            uiSchema={rfiApplicantUiSchema}
            omitExtraData={false}
            formData={rfiDataByRowId.jsonData}
            formContext={{ rfiDueByDate: rfiDataByRowId.jsonData.rfiDueBy }}
            onSubmit={handleSubmit}
            noValidate
          >
            <Button>Save</Button>
          </FormBase>
        </FormDiv>
      </div>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      applicationId: parseInt(ctx.query.id.toString(), 10),
      rfiId: parseInt(ctx.query.applicantRfiId.toString(), 10),
    };
  },
};

export default withRelay(
  ApplicantRfiPage,
  getApplicantRfiIdQuery,
  withRelayOptions
);
