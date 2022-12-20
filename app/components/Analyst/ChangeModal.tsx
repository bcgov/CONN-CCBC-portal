import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  z-index: 2;
`;

const ModalButtons = styled('div')`
  & button {
    margin-right: 1em;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-width: 200px;
  height: 126px;
  resize: none;
  margin-top: 12px;
  margin-bottom: 16px;
`;

interface Props {
  cancelLabel?: string;
  description?: string;
  id?: string;
  maxLength?: number;
  onCancel?: Function;
  onChange: Function;
  onSave: Function;
  saveLabel?: string;
  title?: string;
}

const ChangeModal: React.FC<Props> = ({
  cancelLabel = 'Cancel',
  description = 'Please provide a reason for the change.',
  id = 'change-modal-id',
  maxLength = 1000,
  onCancel = () => {},
  onChange,
  onSave,
  saveLabel = 'Save',
  title = 'Reason for change',
}) => {
  return (
    <StyledModal id={id}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <p>{description}</p>
        <StyledTextArea
          maxLength={maxLength}
          onChange={(e) => onChange(e)}
          data-testid="reason-for-change"
        />
        <ModalButtons>
          <Modal.Close>
            <Button onClick={() => onSave()} data-testid="withdraw-yes-btn">
              {saveLabel}
            </Button>
          </Modal.Close>

          <Modal.Close>
            <Button variant="secondary" onClick={() => onCancel()}>
              {cancelLabel}
            </Button>
          </Modal.Close>
        </ModalButtons>
      </Modal.Content>
    </StyledModal>
  );
};

export default ChangeModal;
