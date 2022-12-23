import { ReactElement } from 'react';
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
  min-width: 400px;
  height: 126px;
  resize: none;
  margin-top: 16px;
  margin-bottom: 16px;
`;

interface Props {
  cancelLabel?: string;
  description?: string | ReactElement;
  id?: string;
  maxLength?: number;
  onCancel?: Function;
  onChange: Function;
  onSave: Function;
  saveLabel?: string;
  title?: string;
  value: string;
}

const ChangeModal: React.FC<Props> = ({
  cancelLabel = 'Cancel',
  description = 'Please provide a reason for the change.',
  id = 'change-modal',
  maxLength = 1000,
  onCancel = () => {},
  onChange,
  onSave,
  saveLabel = 'Save',
  title = 'Reason for change',
  value,
}) => {
  return (
    <StyledModal id={id}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <div>{description}</div>
        <StyledTextArea
          maxLength={maxLength}
          onChange={(e) => onChange(e)}
          value={value}
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
