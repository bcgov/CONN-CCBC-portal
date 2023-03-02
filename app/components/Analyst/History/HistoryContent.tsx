import styled from 'styled-components';
import { DateTime } from 'luxon';
import statusStyles from 'data/statusStyles';
import StatusPill from '../StatusPill';

const HistoryContent = ({ historyItem }) => {
  const { givenName, familyName, tableName, createdAt } = historyItem;
  const fullName = `${givenName} ${familyName}`;
  const date = DateTime.fromJSDate(new Date(createdAt)).toLocaleString(
    DateTime.DATETIME_MED
  );

  const StyledContent = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    & span {
      margin: 0 4px;
    }

    & span:first-child {
      margin-left: 0;
    }
  `;

  if (tableName === 'rfi_data') {
    return (
      <StyledContent>
        {fullName} {date}
      </StyledContent>
    );
  }
  if (tableName === 'application_analyst_lead') {
    return (
      <StyledContent>
        {fullName}
        <span>
          {' '}
          assigned <b>Lead</b> on {date}
        </span>
      </StyledContent>
    );
  }
  if (tableName === 'application') {
    return (
      <StyledContent>
        {fullName} {date}
      </StyledContent>
    );
  }
  if (tableName === 'application_status') {
    return (
      <StyledContent>
        <span>
          {fullName} changed the <b>status</b> to
        </span>
        <StatusPill status={historyItem.item} styles={statusStyles} />
        <span>on {date}</span>
      </StyledContent>
    );
  }
  if (tableName === 'application_package') {
    return (
      <StyledContent>
        {fullName} added the application to a <b>Package</b> on {date}
      </StyledContent>
    );
  }
  if (tableName === 'assessment_data') {
    const assessmentType = historyItem.item;

    return (
      <StyledContent>
        {fullName} saved the{' '}
        <b>
          {assessmentType === 'projectManagement'
            ? 'Project Management'
            : assessmentType}{' '}
          assessment
        </b>{' '}
        on {date}
      </StyledContent>
    );
  }
  return null;
};
export default HistoryContent;
