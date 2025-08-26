import Modal from 'components/Modal';
import styled from 'styled-components';

interface StyledTextAreaProps {
  maxLength?: number;
  onChange?: (e: any) => any;
  value?: string;
  'data-testid'?: string;
}

const StyledTextArea = styled.textarea<StyledTextAreaProps>`
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
  saveDisabled?: boolean;
}

const ChangeModal: React.FC<Props> = ({
  isOpen,
  cancelLabel = 'Cancel',
  description = 'Please provide a reason for the change.',
  id = 'change-modal',
  title = 'Reason for change',
  maxLength = 1000,
  onCancel = () => {},
  onChange,
  onSave,
  saveLabel = 'Save',
  value,
  saveDisabled = false,
}) => {
  return (
    <Modal
      id={id}
      open={isOpen}
      onClose={onCancel}
      title={title}
      actions={[
        {
          id: 'status-change-save-btn',
          label: saveLabel,
          disabled: saveDisabled,
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
