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
}) => {
  const { tableName } = historyItem;

  return (
    tableName !== 'attachment' && (
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
          />
        </StyledCell>
      </tr>
    )
  );
};

export default HistoryRow;
