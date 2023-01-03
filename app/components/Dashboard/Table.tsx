import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Modal, StatusPill, Withdraw } from '.';
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
  const [withdrawId, setWithdrawId] = useState<null | number>(null);

  const applicationNodes = applications.allApplications.nodes;

  const formPages = Object.keys(schema.properties);

  const reviewPage = formPages.indexOf('review') + 1;

  const getStatusType = (status: string) => {
    if (status === 'draft') {
      return 'Draft';
    }
    if (status === 'withdrawn') {
      return 'Withdrawn';
    }

    return 'Submitted';
  };

  return (
    <>
      <StyledTable>
        <StyledTableHead>
          <tr>
            <StyledTableHeadCell>CCBC ID</StyledTableHeadCell>
            <StyledTableHeadCell>Project title</StyledTableHeadCell>
            <StyledTableHeadCell>Status</StyledTableHeadCell>
            <StyledTableHeadCell>Actions</StyledTableHeadCell>
          </tr>
        </StyledTableHead>
        <tbody>
          {applicationNodes.map((application) => {
            const {
              ccbcNumber,
              intakeByIntakeId,
              formData,
              projectName,
              rowId,
              status,
            } = application;

            const lastEditedIndex =
              formPages.indexOf(formData.lastEditedPage) + 1;

            const intakeClosingDate = intakeByIntakeId?.closeTimestamp;
            const isIntakeClosed = intakeClosingDate
              ? Date.parse(intakeClosingDate) < Date.now()
              : false;

            const isWithdrawn = application.status === 'withdrawn';
            const isSubmitted = application.status === 'submitted';

            const getApplicationUrl = () => {
              if (isWithdrawn) {
                return `/applicantportal/form/${application.rowId}/${reviewPage}`;
              }
              if (isSubmitted && isIntakeClosed) {
                return `/applicantportal/form/${application.rowId}/${reviewPage}`;
              }
              if (isSubmitted) {
                return `/applicantportal/form/${rowId}/1`;
              }
              return `/applicantportal/form/${rowId}/${
                formData.lastEditedPage ? lastEditedIndex : 1
              }`;
            };

            return (
              <StyledRow key={rowId}>
                <StyledTableCell>{ccbcNumber || 'Unassigned'}</StyledTableCell>
                <StyledTableCell>{projectName}</StyledTableCell>
                <StyledTableCell>
                  <StatusPill StatusType={getStatusType(status)}>
                    {status}
                  </StatusPill>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledBtns>
                    <Link href={getApplicationUrl()}>
                      {formData.isEditable ? 'Edit' : 'View'}
                    </Link>
                    {isSubmitted && !isIntakeClosed && (
                      <button
                        onClick={() => setWithdrawId(rowId)}
                        data-testid="withdraw-btn-test"
                        type="button"
                      >
                        <Withdraw />
                      </button>
                    )}
                    {application.hasRfiOpen && (
                      <Link
                        href={`/applicantportal/form/${application.rowId}/rfi/${application.rfi.rowId}/`}
                      >
                        Upload Files
                      </Link>
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
