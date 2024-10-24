import HistoryDetails from 'components/Analyst/History/HistoryDetails';
import cbcData from 'formSchema/uiSchema/history/cbcData';
import { DateTime } from 'luxon';
import styled from 'styled-components';

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
  return (
    <StyledChange>
      <b>Reason for change:</b> {reason}
    </StyledChange>
  );
};

const HistoryContent = ({
  createdAt,
  updatedAt,
  prevJson,
  json,
  givenName,
  changeReason,
  familyName,
  op,
  tableName,
}) => {
  const fullName = `${givenName} ${familyName}`;

  const createdAtFormatted =
    op === 'UPDATE'
      ? DateTime.fromJSDate(new Date(updatedAt)).toLocaleString(
          DateTime.DATETIME_MED
        )
      : DateTime.fromJSDate(new Date(createdAt)).toLocaleString(
          DateTime.DATETIME_MED
        );

  if (tableName === 'cbc_data') {
    return (
      <>
        <StyledContent data-testid="cbc-data-updater-and-timestamp">
          <span>
            {fullName} {op === 'UPDATE' ? 'updated' : 'created'} the CBC data on{' '}
            {createdAtFormatted}
          </span>
        </StyledContent>
        <HistoryDetails
          data-testid="cbc-data-history-details"
          json={json}
          prevJson={prevJson}
          excludedKeys={[
            'id',
            'created_at',
            'updated_at',
            'change_reason',
            'cbc_data_id',
          ]}
          diffSchema={cbcData}
          overrideParent="cbcData"
        />
        {op === 'UPDATE' && changeReason !== '' && (
          <ChangeReason reason={changeReason} />
        )}
      </>
    );
  }
  return null;
};

export default HistoryContent;
