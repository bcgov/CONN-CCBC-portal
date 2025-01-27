import Link from 'next/link';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { getFilteredSchemaOrderFromUiSchema } from 'utils/schemaUtils';
import { uiSchema } from 'formSchema';
import StatusPill from '../StatusPill';

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

const StyledButtonLink = styled('button')`
  text-decoration: none;
  color: #1a5a96;
`;

const StyledWithdraw = styled.button`
  color: #d8292f;
`;

const Row = ({ application, onWithdraw, onDelete, schema, editEnabled }) => {
  const { ccbcNumber, intakeByIntakeId, formData, projectName, rowId, status } =
    application;

  const uiOrder = getFilteredSchemaOrderFromUiSchema(schema, uiSchema);
  const lastEditedIndex = uiOrder.indexOf(formData.lastEditedPage) + 1;
  const reviewPage = uiOrder.indexOf('review') + 1;

  const intakeClosingDate = intakeByIntakeId?.closeTimestamp;
  const isIntakeClosed = intakeClosingDate
    ? Date.parse(intakeClosingDate) < Date.now()
    : false;

  const isWithdrawn = status === 'withdrawn';
  const isSubmitted = status === 'submitted';
  const isWithdrawable =
    status === 'received' ||
    status === 'submitted' ||
    status === 'applicant_conditionally_approved';
  const isDraft = application.status === 'draft';
  const isEditable =
    editEnabled && formData.isEditable && status !== 'withdrawn';

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
          <Link href={getApplicationUrl()}>{isEditable ? 'Edit' : 'View'}</Link>
          {isWithdrawable && (
            <StyledWithdraw
              onClick={onWithdraw}
              data-testid="withdraw-btn-test"
              type="button"
            >
              Withdraw
            </StyledWithdraw>
          )}
          {!ccbcNumber && isDraft && (
            <StyledButtonLink
              onClick={onDelete}
              data-testid="archive-btn-test"
              type="button"
            >
              Delete
            </StyledButtonLink>
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
