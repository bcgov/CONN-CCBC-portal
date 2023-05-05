import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { Button } from '@button-inc/bcgov-theme';

import { Layout } from 'components';
import { sowCreateSowDataMutation } from '__generated__/sowCreateSowDataMutation.graphql';

const createSowMutation = graphql`
  mutation sowCreateSowDataMutation($input: ApplicationSowDataInput!) {
    createApplicationSowData(input: {applicationSowData:  $input}) {
        applicationSowData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.2em;
  border: 1px solid #c0c0c0;

  margin-top: 10px;
  & svg {
    margin: 0 8px;
  }
`;

const StyledButton = styled(Button)`
  min-width: 160px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 50%;
`;

const SowTab = () => {
  const handleClick = () => {
    //
  };

  return (
    <div>
      <h2>SoW Input</h2>
      <strong>
        Import am Excel file with the SoW for the application
      </strong>
      <StyledFileDiv>
        <strong>
          Statement of Work
        </strong>
        <StyledButton
          id='json-upload-btn'
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            handleClick();
          }}
        >
          Test
        </StyledButton>
      </StyledFileDiv>
    </div>
  );
};


const UploadSoW = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, sowCreateSowDataMutation>) => {
  const query = usePreloadedQuery(createSowMutation, preloadedQuery);
  const { session } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <SowTab />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(UploadSoW, createSowMutation, defaultRelayOptions);
