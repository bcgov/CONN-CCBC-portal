import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useModal from 'lib/helpers/useModal';
import GenericConfirmationModal from 'lib/theme/widgets/GenericConfirmationModal';
import { DateTime } from 'luxon';
import styled from 'styled-components';

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  word-break: break-word;
  margin-left: 16px;
  margin-top: 10px;
  & svg {
    margin: 0px 8px;
  }
`;

const StyledDeleteBtn = styled('button')`
  &:hover {
    opacity: 0.6;
  }
`;

const StyledLink = styled.button`
  width: 380px;
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  text-align: left;
`;

const ReportRow = ({
  report,
  onDownload,
  onArchive,
  isLoading,
  reportType,
}) => {
  const { id, createdAt } = report;

  const deleteConfirmationModal = useModal();

  const formattedFileName = `Generated ${DateTime.fromISO(createdAt)
    .setZone('America/Los_Angeles')
    .toLocaleString(DateTime.DATETIME_FULL)}`;

  return (
    <>
      <StyledFileDiv key={id}>
        <StyledLink
          data-testid="file-download-link"
          onClick={(e) => {
            e.preventDefault();
            onDownload();
          }}
        >
          {formattedFileName}
        </StyledLink>
        <StyledDeleteBtn
          data-testid="file-delete-btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            deleteConfirmationModal.open();
          }}
          disabled={isLoading}
        >
          <FontAwesomeIcon width={10} icon={faTrash} color="rgb(189, 36, 36)" />
        </StyledDeleteBtn>
      </StyledFileDiv>
      <GenericConfirmationModal
        id="report-delete-confirm-modal"
        title="Delete"
        message={`Are you sure you want to delete this ${reportType} file: ${formattedFileName}?`}
        okLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          onArchive();
          deleteConfirmationModal.close();
        }}
        {...deleteConfirmationModal}
      />
    </>
  );
};

export default ReportRow;
