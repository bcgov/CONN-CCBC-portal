import styled from 'styled-components';
import { DateTime } from 'luxon';
import statusStyles from 'data/statusStyles';
import StatusPill from '../StatusPill';

const StyledContent = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;

  & span {
    margin: 0 4px;
  }

  & span:first-child {
    margin-left: 0;
  }
`;

const StyledChange = styled.div`
  padding: 8px 16px;
`;

const ChangeReason = ({ reason }) => {
  return <StyledChange>Reason for change: {reason}</StyledChange>;
};

const HistoryContent = ({ historyItem }) => {
  const { givenName, familyName, tableName, createdAt, record } = historyItem;
  const fullName = `${givenName} ${familyName}`;
  const reasonForChange = record.reason_for_change || record.change_reason;

  const createdAtFormatted = DateTime.fromJSDate(
    new Date(createdAt)
  ).toLocaleString(DateTime.DATETIME_MED);

  if (tableName === 'rfi_data') {
    const rfiNumber = record.rfi_number;

    return (
      <StyledContent>
        <span>{fullName} saved</span> <b>RFI-{rfiNumber}</b>
        <span>on {createdAtFormatted}</span>
      </StyledContent>
    );
  }

  if (tableName === 'attachment') {
    return (
      <StyledContent>
        <span>
          {fullName} uploaded a file on {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'rfi_data') {
    const rfiNumber = record.rfi_number;

    return (
      <StyledContent>
        <span>{fullName} saved</span> <b>{rfiNumber}</b>
        <span>on {createdAtFormatted}</span>
      </StyledContent>
    );
  }
  if (tableName === 'application_analyst_lead') {
    return (
      <StyledContent>
        {fullName}
        <span>
          {' '}
          assigned <b>Lead</b> on {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }
  if (tableName === 'application') {
    return (
      <StyledContent>
        <span>
          The applicant created the <b>Application</b>
        </span>{' '}
        on {createdAtFormatted}
      </StyledContent>
    );
  }

  if (tableName === 'form_data') {
    return (
      <div>
        <StyledContent>
          <span>
            {fullName} edited the <b>Application</b>
          </span>
          on {createdAtFormatted}
        </StyledContent>
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_status') {
    return (
      <div>
        <StyledContent>
          <span>
            {fullName} changed the <b>status</b> to
          </span>
          <StatusPill status={historyItem.item} styles={statusStyles} />
          <span>on {createdAtFormatted}</span>
        </StyledContent>
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }
  if (tableName === 'application_package') {
    return (
      <StyledContent>
        {fullName} added the application to a <b>Package</b> on{' '}
        {createdAtFormatted}
      </StyledContent>
    );
  }
  if (tableName === 'assessment_data') {
    const assessmentType = historyItem.item;

    const formatAssessment = (assessmentName) => {
      if (assessmentType === 'projectManagement') return 'Project Management';
      if (assessmentType === 'financialRisk') return 'Financial Risk';
      return assessmentName;
    };

    return (
      <StyledContent>
        <span>{fullName} saved the</span>
        <b>{formatAssessment(assessmentType)} Assessment</b>
        <span>on {createdAtFormatted}</span>
      </StyledContent>
    );
  }
  return null;
};
export default HistoryContent;
