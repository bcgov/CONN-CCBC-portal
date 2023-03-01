import styled from 'styled-components';
import HistoryRow from './HistoryRow';

const StyledTable = styled.table`
  border: none;
  table-layout: fixed;
  margin-left: 8px;

  & td {
    padding-top: 0;
    padding-bottom: 16px;
  }

  & tr:last-child {
    td {
      padding-bottom: 0px;
    }
  }
`;

const HistoryTable: React.FC = () => {
  return (
    <StyledTable cellSpacing="0" cellPadding="0">
      <HistoryRow />
      <HistoryRow />
      <HistoryRow />
    </StyledTable>
  );
};

export default HistoryTable;
