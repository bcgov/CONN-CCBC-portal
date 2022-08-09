import { useRouter } from 'next/router';
import { ApplicationForm, Back } from '../../../components/Form';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import FormDiv from '../../../components/FormDiv';
import Alert from '@button-inc/bcgov-theme/Alert';
import { Layout } from '../../../components';
import styled from 'styled-components';

const AppName = styled('div')`
  max-width: 280px;
  white-space: nowrap;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 1rem;
`;

const AppStatus = styled('div')`
  text-transform: capitalize;
  font-style: italic;
`;

const StatusNameFlex = styled('div')`
  display: flex;
`;

const Flex = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 32px;
`;

import { PageQuery } from '../../../__generated__/PageQuery.graphql';
import { useUpdateApplicationMutation } from 'schema/mutations/application/updateApplication';

const getPageQuery = graphql`
  query PageQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      formData
      id
      owner
      referenceNumber
      status
      ...ApplicationForm_application
    }
    session {
      sub
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/ban-types
const FormPage = ({ preloadedQuery }: RelayProps<{}, PageQuery>) => {
  const query = usePreloadedQuery(getPageQuery, preloadedQuery);

  const { applicationByRowId, session } = query;
  const { status } = applicationByRowId;
  const router = useRouter();

  const applicationId = Number(router.query.id);

  const formData = applicationByRowId?.formData;
  const pageNumber = Number(router.query.page);

  const [updateApplication, isUpdating] = useUpdateApplicationMutation();

  return (
    <Layout session={session} title="Connecting Communities BC">
      <FormDiv>
        {status === 'withdrawn' && (
          <StyledAlert id="review-alert" size="small" variant={'warning'}>
            You can no longer edit this application because it is withdrawn.
          </StyledAlert>
        )}
        <Flex>
          <Back applicationId={applicationId} pageNumber={pageNumber} />
          <div>
            <StatusNameFlex>
              <AppStatus>{applicationByRowId.status}</AppStatus>
              <AppName>{formData?.projectInformation?.projectTitle}</AppName>
            </StatusNameFlex>
            {isUpdating && 'saving...'}
          </div>
        </Flex>
        <ApplicationForm
          pageNumber={pageNumber}
          application={applicationByRowId}
          onUpdateApplication={updateApplication}
        />
      </FormDiv>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.id.toString()),
    };
  },
};

export default withRelay(FormPage, getPageQuery, withRelayOptions);
