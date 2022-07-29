import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { StatusPill } from '.';
import { dashboardQuery$data } from '../../__generated__/dashboardQuery.graphql';

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

const StyledRow = styled('tr')`
  &:hover {
    background: #f2f2f2;
  }
`;

const StyledTableCell = styled('td')`
  padding: 12px;
  &:first-child {
    padding: 12px;
  }
  &:last-child {
    padding: 12px;
  }
`;

type Props = {
  applications: Pick<dashboardQuery$data, 'allApplications'>;
};

const Table = ({ applications }: Props) => {
  const applicationNodes = applications.allApplications.nodes;

  const router = useRouter();

  const handleGoToReviewPage = (application) => {
    router.push(`/form/${application.rowId}/19`);
  };

  const getStatusType = (status: string) => {
    if (status === 'draft') {
      return 'Draft';
    } else if (status === 'withdrawn') {
      return 'Withdrawn';
    }

    return 'Submitted';
  };

  const pad = (num: number, size: number) => {
    const s = "000000000" + num;
    return s.substring(s.length-size);
  }

  const ccbcId = (application) =>{
    return application.referenceNumber 
      ? `CCBC-${pad(application.referenceNumber, 2)}${pad(application.rowId, 4)}`
      : 'Unassigned';
  }

  return (
    <StyledTable>
      <StyledTableHead>
        <tr>
          <StyledTableHeadCell>CCBC Id</StyledTableHeadCell>
          <StyledTableHeadCell>Project Name</StyledTableHeadCell>
          <StyledTableHeadCell>Status</StyledTableHeadCell>
          <StyledTableHeadCell>Actions</StyledTableHeadCell>
        </tr>
      </StyledTableHead>
      <tbody>
        {/* map through actual rows */}
        {applicationNodes.map((application) => (
          <StyledRow key={application.rowId}>
            <StyledTableCell>
              {ccbcId(application)}
            </StyledTableCell>
            <StyledTableCell>{application.projectName}</StyledTableCell>
            <StyledTableCell>
              <StatusPill StatusType={getStatusType(application.status)}>
                {application.status}
              </StatusPill>
            </StyledTableCell>
            <StyledTableCell>
              <Link href={`/form/${application.rowId}/1`}>Edit</Link>
            </StyledTableCell>
          </StyledRow>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default Table;
