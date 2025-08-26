import HistoryDetails from 'components/Analyst/History/HistoryDetails';
import cbcData from 'formSchema/uiSchema/history/cbcData';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import CommunitiesHistoryTable from '../../History/CommunitiesHistoryTable';

interface StyledContentProps {
  children?: React.ReactNode;
}

const StyledContent = styled.span<StyledContentProps>`
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

interface StyledChangeProps {
  children?: React.ReactNode;
}

const StyledChange = styled.div<StyledChangeProps>`
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
  user,
  changeReason,
  op,
  tableName,
}) => {
  const createdAtFormatted =
    op === 'UPDATE'
      ? DateTime.fromJSDate(new Date(updatedAt)).toLocaleString(
          DateTime.DATETIME_MED
        )
      : DateTime.fromJSDate(new Date(createdAt)).toLocaleString(
          DateTime.DATETIME_MED
        );

  if (tableName === 'cbc_data') {
    const normalizedCbcPrevJson = { zones: [], ...prevJson };
    const normalizedCbcJson = { zones: [], ...json };
    return (
      <>
        <StyledContent data-testid="cbc-data-updater-and-timestamp">
          <span>
            {user} {op === 'UPDATE' ? 'updated' : 'created'} the CBC data on{' '}
            {createdAtFormatted}
          </span>
        </StyledContent>
        <HistoryDetails
          data-testid="cbc-data-history-details"
          json={normalizedCbcJson}
          prevJson={normalizedCbcPrevJson}
          excludedKeys={[
            'id',
            'created_at',
            'updated_at',
            'change_reason',
            'cbc_data_id',
            'locations',
          ]}
          diffSchema={cbcData}
          overrideParent="cbcData"
        />
        {json?.locations?.added?.length > 0 && (
          <CommunitiesHistoryTable
            action="Added"
            communities={json?.locations?.added}
          />
        )}
        {json?.locations?.removed?.length > 0 && (
          <CommunitiesHistoryTable
            action="Deleted"
            communities={json?.locations?.removed}
          />
        )}
        {op === 'UPDATE' && changeReason !== '' && (
          <ChangeReason reason={changeReason} />
        )}
      </>
    );
  }
  return null;
};

export default HistoryContent;
