import Modal from 'components/Modal';

type UnsavedChangesWarningModalProps = {
  isOpen: boolean;
  onDiscard: () => void;
  onDismiss: () => void;
};

const UnsavedChangesWarningModal = ({
  isOpen,
  onDiscard,
  onDismiss,
}: UnsavedChangesWarningModalProps) => {
  return (
    <Modal
      id="unsaved-changed-warning-modal"
      open={isOpen}
      onClose={onDismiss}
      title="Unsaved Changes"
      actions={[
        {
          id: 'prevent-nav-yes-btn',
          label: 'Yes, Discard Changes',
          onClick: onDiscard,
        },
        {
          id: 'prevent-nav-no-btn',
          label: 'No, Stay on Page',
          onClick: onDismiss,
        },
      ]}
    >
      <p>
        Changes not saved. Please confirm if you want to exit without saving.
      </p>
    </Modal>
  );
};

export default UnsavedChangesWarningModal;
