import styled from 'styled-components';
import HistoryContent from './HistoryContent';
import HistoryIcon from './HistoryIcon';

const StyledIconCell = styled.td`
  width: 5px;
  border-left: 1px solid ${(props) => props.theme.color.links};
  border-bottom: none;
  position: relative;

  & div {
    position: absolute;
    right: 2px;
    top: -2px;
  }
`;

const StyledCell = styled.td`
  border-bottom: none;

  & b {
    text-transform: capitalize;
  }
`;

const HistoryRow = ({
  historyItem,
  prevHistoryItem,
  originalOrganizationName,
  originalProjectTitle,
  recordWithOrgChange,
  recordWithTitleChange,
  announcements,
}) => {
  const { tableName, user } = historyItem;

  // If tableName is form_data and prevJson is an empty object, return nothing
  // this matches the logic of the change log
  if (tableName === 'form_data') {
    const prevJson = prevHistoryItem?.record?.json_data || {};
    if (Object.keys(prevJson).length === 0) {
      return null;
    }
  }

  return (
    !(
      tableName === 'attachment' ||
      (tableName === 'application_dependencies' && user === 'The applicant')
    ) && (
      <tr>
        <StyledIconCell>
          <HistoryIcon type={tableName} />
        </StyledIconCell>
        <StyledCell>
          <HistoryContent
            historyItem={historyItem}
            prevHistoryItem={prevHistoryItem}
            originalOrganizationName={originalOrganizationName}
            originalProjectTitle={originalProjectTitle}
            recordWithOrgChange={recordWithOrgChange}
            recordWithTitleChange={recordWithTitleChange}
            announcements={announcements}
          />
        </StyledCell>
      </tr>
    )
  );
};

export default HistoryRow;
