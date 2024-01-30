import Modal from 'components/Modal';
import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  width: 100%;
  min-width: 400px;
  height: 126px;
  resize: none;
  margin-top: 16px;
  margin-bottom: 16px;
`;

interface Props {
  isOpen: boolean;
  cancelLabel?: string;
  description?: string | React.ReactNode;
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
  isOpen,
  cancelLabel = 'Cancel',
  description = 'Please provide a reason for the change.',
  id = 'change-modal',
  maxLength = 1000,
  onCancel = () => {},
  onChange,
  onSave,
  saveLabel = 'Save',
  value,
}) => {
  return (
    <Modal
      id={id}
      open={isOpen}
      onClose={onCancel}
      title="Reason for change"
      actions={[
        {
          id: 'status-change-save-btn',
          label: saveLabel,
          onClick: () => onSave(),
        },
        {
          id: 'status-change-cancel-btn',
          label: cancelLabel,
          onClick: () => onCancel(),
          variant: 'secondary',
        },
      ]}
    >
      <div>{description} </div>
      <StyledTextArea
        maxLength={maxLength}
        onChange={(e) => onChange(e)}
        value={value}
        data-testid="reason-for-change"
      />
    </Modal>
  );
};

export default ChangeModal;
