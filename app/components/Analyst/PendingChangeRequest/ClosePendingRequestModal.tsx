import Modal from 'components/Modal';

interface Props {
  isOpen: boolean;
  onCancel?: Function;
  onSave: Function;
}

const ClosePendingRequestModal: React.FC<Props> = ({
  isOpen,
  onCancel = () => {},
  onSave,
}) => {
  return (
    <Modal
      id="pending-change-request-modal"
      open={isOpen}
      onClose={onCancel}
      size="lg"
      title="Done with this change request?"
      actions={[
        {
          id: 'pending-request-change-save-btn',
          label: 'Save',
          onClick: () => onSave(),
        },
        {
          id: 'pending-request-change-cancel-btn',
          label: 'No, Keep Pending',
          onClick: () => onCancel(),
          variant: 'secondary',
        },
      ]}
    >
      <p>Please select the appropriate option below</p>
    </Modal>
  );
};

export default ClosePendingRequestModal;
