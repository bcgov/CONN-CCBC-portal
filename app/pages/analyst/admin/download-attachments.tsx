import { ChangeEvent, useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { ButtonLink, Layout } from 'components';
import AdminTabs from 'components/Admin/AdminTabs';
import { downloadAttachmentsQuery } from '__generated__/downloadAttachmentsQuery.graphql';

const getDownloadAttachmentsQuery = graphql`
  query downloadAttachmentsQuery {
    session {
      sub
      ...DashboardTabs_query  
    }
    allIntakes {
      nodes {
        ccbcIntakeNumber
        closeTimestamp
        openTimestamp
        rowId
      }
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;
const StyledBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.25rem;
`;
const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const StyledOption = styled.option``;
 
const AttachmentsTab = (allIntakes) =>{
  
  const [intake, setIntake] = useState('');
  const {nodes} = allIntakes;
  const selectIntake = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setIntake(selected);
  }

  return (
    <div>
    <StyledDropdown name="select-intake" data-testid="select-intake-test" onChange={(e) => selectIntake(e)}>
      {nodes && nodes.map((intakeData) => {
        const startDate = DateTime.fromISO(intakeData.openTimestamp, {
          locale: 'en-CA',
          zone: 'America/Vancouver',
        }).toFormat('MMMM dd, yyyy');
        const endDate = DateTime.fromISO(intakeData.closeTimestamp, {
          locale: 'en-CA',
          zone: 'America/Vancouver',
        }).toFormat('MMMM dd, yyyy');
        const intakeName = `Intake ${intakeData.ccbcIntakeNumber}. ${startDate} - ${endDate}`;

        return (
          <StyledOption
            id = {intakeData.rowId}
            key={intakeData.rowId}
            value={intakeData.ccbcIntakeNumber}
            selected={intakeData.ccbcIntakeNumber === intake}
          >
            {intakeName}
          </StyledOption>
        );
      })}
    </StyledDropdown>
      <StyledBtnContainer>
        <ButtonLink href = {`/api/analyst/admin-archive/${intake}`} >
          Export attachments
        </ButtonLink>
      </StyledBtnContainer>
    </div>
  )
}
const DownloadAttachments = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, downloadAttachmentsQuery>) => {

  const query = usePreloadedQuery(getDownloadAttachmentsQuery, preloadedQuery);
  const { session, allIntakes } = query;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <AttachmentsTab {...allIntakes}/>
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  DownloadAttachments,
  getDownloadAttachmentsQuery,
  defaultRelayOptions
);
