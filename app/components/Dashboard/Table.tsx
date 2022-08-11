import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Modal, StatusPill, Withdraw, X } from '.';
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

const StyledBtns = styled('div')`
  display: flex;
  align-items: center;
  & a {
    text-decoration: none;
    color: #1a5a96;
  }
`;

type Props = {
  applications: Pick<dashboardQuery$data, 'allApplications'>;
};

const Table = ({ applications }: Props) => {
  const [withdrawId, setWithdrawId] = useState('');
  const applicationNodes = applications.allApplications.nodes;
  const router = useRouter();

  const formPages = Object.keys(schema({}).properties);

  const reviewPage = formPages.indexOf('review') + 1;

  const handleGoToReviewPage = (application) => {
    router.push(`/form/${application.rowId}/${reviewPage}`);
  };

  const getStatusType = (status: string) => {
    if (status === 'draft') {
      return 'Draft';
    } else if (status === 'withdrawn') {
      return 'Withdrawn';
    }

    return 'Submitted';
  };

  return (
    <>
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

            const intakeClosingDate = intakeByIntakeId?.closeTimestamp;
            const isIntakeClosed = intakeClosingDate
              ? Date.parse(intakeClosingDate) < Date.now()
              : false;

            const isWithdrawn = application.status === 'withdrawn';

            const getApplicationUrl = (status: string) => {
              if (status === 'withdrawn') {
                return `/form/${application.rowId}/${reviewPage}`;
              } else if (status === 'submitted') {
                return `/form/${rowId}/1`;
              } else {
                return `/form/${rowId}/${lastEditedPage ? lastEditedIndex : 1}`;
              }
            };

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
                  <StyledBtns>
                    <Link href={getApplicationUrl(application.status)}>
                      {isWithdrawn && !isIntakeClosed ? 'View' : 'Edit'}
                    </Link>
                    {application.status === 'submitted' && !isIntakeClosed && (
                      <div onClick={() => setWithdrawId(application.id)}>
                        <Withdraw />
                      </div>
                    )}
                  </StyledBtns>
                </StyledTableCell>
              </StyledRow>
            );
          })}
        </tbody>
      </StyledTable>

      <Modal id={withdrawId} />
    </>
  );
};

export default Table;
