import styled from 'styled-components';

const StyledDiv = styled.div`
  font-weight: 550;
  margin-top: 20px;
  font-size: 0.8rem;
`;

interface Props {
  // filtered row count for that specific criteria
  visibleRowCount: number;
  // total number of record count available in database
  totalRowCount: number;
}

const RowCount: React.FC<Props> = ({ visibleRowCount, totalRowCount }) => {
  return (
    <StyledDiv>
      Showing {visibleRowCount} of {totalRowCount} rows
    </StyledDiv>
  );
};

export default RowCount;
