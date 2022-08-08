import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { StatusPill } from '.';
import { dashboardQuery$data } from '../../__generated__/dashboardQuery.graphql';
import schema from '../../formSchema/schema';

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

  const formPages = Object.keys(schema({}).properties);

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
        {applicationNodes.map((application) => {
          const {
            ccbcId,
            intakeByIntakeId,
            lastEditedPage,
            projectName,
            rowId,
            status,
          } = application;

          const lastEditedIndex = formPages.indexOf(lastEditedPage) + 1;
          const editUrl = `/form/${rowId}/${
            lastEditedPage ? lastEditedIndex : 1
          }`;

          const intakeClosingDate = intakeByIntakeId?.closeTimestamp;
          const editSubmittedUrl = `/form/${rowId}/1`;
          const isIntakeClosed = intakeClosingDate
            ? Date.parse(intakeClosingDate) < Date.now()
            : false;

          return (
            <StyledRow key={rowId}>
              <StyledTableCell>{ccbcId || 'Unassigned'}</StyledTableCell>
              <StyledTableCell>{projectName}</StyledTableCell>
              <StyledTableCell>
                <StatusPill StatusType={getStatusType(status)}>
                  {status}
                </StatusPill>
              </StyledTableCell>
              <StyledTableCell>
                {!isIntakeClosed && (
                  <Link
                    href={status === 'submitted' ? editSubmittedUrl : editUrl}
                  >
                    Edit
                  </Link>
                )}
              </StyledTableCell>
            </StyledRow>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default Table;
