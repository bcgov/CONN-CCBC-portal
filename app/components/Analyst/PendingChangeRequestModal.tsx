import Modal from 'components/Modal';
import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  width: 100%;
  min-width: 500px;
  height: 126px;
  resize: none;
  margin-top: 16px;
  margin-bottom: 16px;
`;

interface Props {
  isOpen: boolean;
  maxLength?: number;
  onCancel?: Function;
  onSave: Function;
  onChange: Function;
  value: string;
}

const PendingChangeRequestModal: React.FC<Props> = ({
  isOpen,
  maxLength = 100,
  onCancel = () => {},
  onSave,
  onChange,
  value,
}) => {
  return (
    <Modal
      id="pending-change-request-modal"
      open={isOpen}
      onClose={onCancel}
      size="lg"
      title="Comments on pending changes (optional)"
      actions={[
        {
          id: 'pending-request-change-save-btn',
          label: 'Save comment',
          onClick: () => onSave(),
        },
        {
          id: 'pending-request-change-cancel-btn',
          label: 'Cancel',
          onClick: () => onCancel(),
          variant: 'secondary',
        },
      ]}
    >
      <StyledTextArea
        maxLength={maxLength}
        value={value}
        data-testid="comments-for-change"
        onChange={(e) => onChange(e)}
      />
    </Modal>
  );
};

export default PendingChangeRequestModal;
