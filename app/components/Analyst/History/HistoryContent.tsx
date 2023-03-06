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
  const {
    givenName,
    familyName,
    tableName,
    createdAt,
    item,
    record,
    sessionSub,
  } = historyItem;

  const isAnalyst = sessionSub.includes('idir');
  const fullName = `${givenName} ${familyName}`;
  const displayName = isAnalyst ? fullName : 'The applicant';
  const reasonForChange = record.reason_for_change || record.change_reason;
  const createdAtFormatted = DateTime.fromJSDate(
    new Date(createdAt)
  ).toLocaleString(DateTime.DATETIME_MED);

  if (tableName === 'rfi_data') {
    const rfiNumber = record.rfi_number;

    return (
      <StyledContent data-testid="history-content-rfi">
        <span>{displayName} saved</span> <b>RFI-{rfiNumber}</b>
        <span> on {createdAtFormatted}</span>
      </StyledContent>
    );
  }

  if (tableName === 'attachment') {
    return (
      <StyledContent data-testid="history-content-attachment">
        <span>
          {displayName} uploaded a file on {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'application_analyst_lead') {
    return (
      <StyledContent data-testid="history-content-analyst-lead">
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
      <StyledContent data-testid="history-content-application">
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
        <StyledContent data-testid="history-content-form-data">
          <span>
            {fullName} edited the <b>Application </b>
          </span>
          on {createdAtFormatted}
        </StyledContent>
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_status') {
    const isReceived = item === 'received';
    return (
      <div>
        <StyledContent data-testid="history-content-status">
          {isReceived ? (
            <span>The application was</span>
          ) : (
            <span>
              {displayName} changed the <b>status</b> to
            </span>
          )}{' '}
          <StatusPill status={item} styles={statusStyles} />{' '}
          <span>on {createdAtFormatted}</span>
        </StyledContent>
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_package') {
    return (
      <StyledContent data-testid="history-content-package">
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
      <StyledContent data-testid="history-content-assessment">
        <span>{fullName} saved the </span>
        <b>{formatAssessment(assessmentType)} Assessment</b>
        <span> on {createdAtFormatted}</span>
      </StyledContent>
    );
  }

  return null;
};
export default HistoryContent;
