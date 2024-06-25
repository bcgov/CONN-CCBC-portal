import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GenericConfirmationModal from 'lib/theme/widgets/GenericConfirmationModal';
import styled from 'styled-components';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import useModal from 'lib/helpers/useModal';

interface Props {
  id: string;
  onConfirm: () => void;
}

const StyledButton = styled('button')`
  color: ${(props) => props.theme.color.links};
`;

const CbcRecordLock: React.FC<Props> = ({ id, onConfirm }) => {
  const lockedEditConfirmModal = useModal();
  return (
    <>
      <StyledButton
        data-testid={id}
        onClick={() => {
          lockedEditConfirmModal.open();
        }}
        type="button"
      >
        <FontAwesomeIcon icon={faLock} size="sm" color="#1A5A96" />
      </StyledButton>
      <GenericConfirmationModal
        id="locked-edit-confirm-modal"
        title="Edit"
        message="The project is currently locked for editing. Would you still like to continue?"
        okLabel="Yes, edit"
        cancelLabel="Cancel"
        onConfirm={() => {
          onConfirm();
          lockedEditConfirmModal.close();
        }}
        {...lockedEditConfirmModal}
      />
    </>
  );
};

export default CbcRecordLock;
