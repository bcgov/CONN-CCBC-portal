import Link from 'next/link';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import StatusPill from '../StatusPill';
import Withdraw from './Withdraw';

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
  justify-content: flex-start;
  gap: 24px;
  align-items: center;
  & a {
    text-decoration: none;
    color: #1a5a96;
  }
`;

const Row = ({
  application,
  formPages,
  reviewPage,
  setWithdrawId,
  setArchiveId,
}) => {
  const { ccbcNumber, intakeByIntakeId, formData, projectName, rowId, status } =
    application;

  const lastEditedIndex = formPages.indexOf(formData.lastEditedPage) + 1;

  const intakeClosingDate = intakeByIntakeId?.closeTimestamp;
  const isIntakeClosed = intakeClosingDate
    ? Date.parse(intakeClosingDate) < Date.now()
    : false;

  const isWithdrawn = application.status === 'withdrawn';
  const isSubmitted = application.status === 'submitted';
  const isDraft = application.status === 'draft';

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
      <StyledTableCell width="15%">
        {ccbcNumber || 'Unassigned'}
      </StyledTableCell>
      <StyledTableCell width="10%">
        {intakeByIntakeId?.ccbcIntakeNumber}
      </StyledTableCell>
      <StyledTableCell>{projectName}</StyledTableCell>
      <StyledTableCell>
        <StatusPill styles={statusStyles} status={status} />
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
          {!ccbcNumber && isDraft && (
            <button
              onClick={() => {
                setArchiveId(rowId);
                window.location.hash = 'delete-application';
              }}
              data-testid="archive-btn-test"
              type="button"
            >
              Delete
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
};

export default Row;
