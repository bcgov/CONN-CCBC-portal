import styled from 'styled-components';
import { dashboardAnalystQuery$data } from '__generated__/dashboardAnalystQuery.graphql';
import AnalystRow from './AnalystRow';

const StyledTable = styled('table')`
  margin-bottom: 0px;
  table-layout: fixed;
  width: 100%;
  max-width: 1170px;
`;

const StyledTableHead = styled('thead')`
  padding: 16px 8px;
`;

const StyledTableHeadCell = styled('th')`
  padding: 12px;

  border-top: 1px solid hsla(0, 0%, 0%, 0.12);

  &:first-child {
    padding: 12px;
  }
  &:last-child {
    padding: 12px;
    box-shadow: none;
  }
  font-weight: bold;

  box-shadow: inset -2px 0px white;
`;

interface Props {
  applications: Pick<dashboardAnalystQuery$data, 'allApplications'>;
}

const AnalystTable: React.FC<Props> = ({ applications }) => {
  return (
    <StyledTable>
      <StyledTableHead>
        <tr>
          <StyledTableHeadCell>CCBC ID</StyledTableHeadCell>
          <StyledTableHeadCell>Status</StyledTableHeadCell>
          <StyledTableHeadCell>Project title</StyledTableHeadCell>
          <StyledTableHeadCell>Organization</StyledTableHeadCell>
          <StyledTableHeadCell>Lead</StyledTableHeadCell>
          <StyledTableHeadCell>Package</StyledTableHeadCell>
        </tr>
      </StyledTableHead>
      <tbody>
        {applications.allApplications?.nodes.map((application) => {
          return <AnalystRow application={application} key={application.id} />;
        })}
      </tbody>
    </StyledTable>
  );
};

export default AnalystTable;
