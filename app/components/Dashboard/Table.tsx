
import React from 'react';
import styled from 'styled-components';
import { StatusPill } from '.';


const StyledTable = styled('table')`
  margin-bottom: 0px;
`

const StyledTableHead = styled('thead')`
`;

const StyledTableHeadCell = styled('th')`
padding: 12px;

background: rgba(49, 49, 50, 0.1);
  // border-collapse: separate;
  &:first-child {
    padding: 12px
  };
  &:last-child {
    padding: 12px;
    box-shadow: none;
  }
  font-weight: bold;

  box-shadow: inset -2px 0px white;
`

const StyledRow = styled('tr')`
  &:hover {
    background: #f2f2f2;
  }
`;

const StyledTableCell = styled('td')`
  padding: 12px;
  &:first-child {
    padding: 12px
  };
  &:last-child {
    padding: 12px
  }
`


// type Props = {
//   applications: 
// }

const Table = ({applications}: any) => {

  return (
    <StyledTable>
      <StyledTableHead>
        <tr>
          <StyledTableHeadCell>
            Application Id
          </StyledTableHeadCell>
          <StyledTableHeadCell>
            Project Name
          </StyledTableHeadCell>
          <StyledTableHeadCell>
            Status
          </StyledTableHeadCell>
          <StyledTableHeadCell>
            Actions
          </StyledTableHeadCell>
        </tr>
      </StyledTableHead>
      <tbody>
        {/* map through actual rows */}
        <StyledRow>
          <StyledTableCell>
            Unassigned
          </StyledTableCell>
          <StyledTableCell>
            Project Name
          </StyledTableCell>
          <StyledTableCell>
            <StatusPill StatusType='Withdrawn'>
            Withdrawn
            </StatusPill>
          </StyledTableCell>
          <StyledTableCell>
            Edit Withdraw
          </StyledTableCell>
        </StyledRow>
      </tbody>
    </StyledTable>
  )
}

export default Table