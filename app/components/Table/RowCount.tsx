import styled from 'styled-components';

const StyledDiv = styled.div`
  font-weight: 550;
  margin-top: 1%;
  font-size: 10pt;
`;

interface Props {
  rowCount: number;
  totalCount: number;
}

const RowCount: React.FC<Props> = ({ rowCount, totalCount }) => {
  return (
    <StyledDiv>
      Showing {rowCount} of {totalCount} rows
    </StyledDiv>
  );
};

export default RowCount;
