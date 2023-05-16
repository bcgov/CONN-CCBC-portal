import React, { useState } from 'react';
import styled from 'styled-components';
import schema from 'formSchema/schema';
import { dashboardQuery$data } from '__generated__/dashboardQuery.graphql';
import Modal from './Modal';
import Row from './Row';

const StyledTable = styled('table')`
  margin-bottom: 0px;
`;

const StyledTableHead = styled('thead')``;

const StyledTableHeadCell = styled('th')`
  padding: 12px;

  background: rgba(49, 49, 50, 0.1);
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

type Props = {
  applications: Pick<dashboardQuery$data, 'allApplications'>;
};

const Table = ({ applications }: Props) => {
  const [withdrawId, setWithdrawId] = useState<null | number>(null);

  const applicationNodes = applications.allApplications.nodes;

  const formPages = Object.keys(schema.properties);

  const reviewPage = formPages.indexOf('review') + 1;
  return (
    <>
      <StyledTable>
        <StyledTableHead>
          <tr>
            <StyledTableHeadCell>CCBC ID</StyledTableHeadCell>
            <StyledTableHeadCell>Intake</StyledTableHeadCell>
            <StyledTableHeadCell>Project title</StyledTableHeadCell>
            <StyledTableHeadCell>Status</StyledTableHeadCell>
            <StyledTableHeadCell>Actions</StyledTableHeadCell>
          </tr>
        </StyledTableHead>
        <tbody>
          {applicationNodes.map((application) => {
            return (
              <Row
                application={application}
                key={application.owner}
                formPages={formPages}
                reviewPage={reviewPage}
                setWithdrawId={setWithdrawId}
              />
            );
          })}
        </tbody>
      </StyledTable>

      <Modal id={withdrawId} />
    </>
  );
};

export default Table;
