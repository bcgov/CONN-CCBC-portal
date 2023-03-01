import styled from 'styled-components';
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
`;

const HistoryRow = () => {
  return (
    <tr>
      <StyledIconCell>
        <HistoryIcon type="status" />
      </StyledIconCell>
      <StyledCell>column 2</StyledCell>
    </tr>
  );
};

export default HistoryRow;
