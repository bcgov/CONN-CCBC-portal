import { ChangeEvent, useState } from 'react';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import cookie from 'js-cookie';
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
    allIntakes(orderBy: CLOSE_TIMESTAMP_DESC) {
      nodes {
        ccbcIntakeNumber
        closeTimestamp
        openTimestamp
        rowId
        rollingIntake
      }
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;
const StyledCaption = styled.div`
  line-height: 2.5rem;
`;

const StyledBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.25rem;
  margin-top: 2rem;
  flex-direction: row;
  justify-content: left;
`;
const StyledDropdown = styled.select<{ children?: React.ReactNode }>`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 8px;
  max-width: 100%;
  border-radius: 4px;
  margin-top: 0.25rem;
  position: relative;
  justify-content: left;
`;

const AttachmentsTab = (allIntakes) => {
  const { nodes } = allIntakes;
  const mockDate = cookie.get('mocks.mocked_timestamp');
  const dateValue = mockDate
    ? 1000 * parseInt(mockDate, 10)
    : DateTime.now().valueOf();
  const today = DateTime.fromMillis(dateValue);

  const filtered = nodes.filter(
    (x) => DateTime.fromISO(x.closeTimestamp) <= today || x.rollingIntake
  );

  const lastIntake =
    filtered && filtered.length > 0 ? filtered[0].ccbcIntakeNumber : '1';

  const [intake, setIntake] = useState(lastIntake);
  const selectIntake = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setIntake(selected);
  };

  const handleDownload = async () => {
    const selectedIntake =
      nodes.filter((node) => node.ccbcIntakeNumber === intake) || [];
    const isRollingIntake = selectedIntake[0]?.rollingIntake ?? false;
    const url = `/api/analyst/admin-archive/${intake}?isRollingIntake=${isRollingIntake}`;

    await fetch(url)
      .then((response) => response.json())
      .then((response) => {
        window.open(response, '_blank');
      });
  };

  return (
    <div>
      <h2>Download Attachments</h2>
      <strong>Which intake would you like to download files from?</strong>
      <StyledCaption>
        This downloads everyting applicants uploaded with their applications. It
        does not include files received through RFIs.
      </StyledCaption>
      {filtered && (
        <StyledDropdown
          as="select"
          name="select-intake"
          data-testid="select-intake-test"
          onChange={(e) => selectIntake(e)}
        >
          {filtered?.map((intakeData) => {
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
              <option
                id={intakeData.rowId}
                key={intakeData.rowId}
                value={intakeData.ccbcIntakeNumber}
                selected={intakeData.ccbcIntakeNumber === intake}
              >
                {intakeName}
              </option>
            );
          })}
        </StyledDropdown>
      )}
      <StyledBtnContainer>
        <ButtonLink onClick={handleDownload} href="#">
          Download attachments
        </ButtonLink>
      </StyledBtnContainer>
    </div>
  );
};
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
        <AttachmentsTab {...allIntakes} />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  DownloadAttachments,
  getDownloadAttachmentsQuery,
  defaultRelayOptions
);
