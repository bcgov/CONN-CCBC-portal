import Modal from 'components/Modal';

/**
 * Generic Modal to show generic confirmation dialog
 */
const GenericConfirmationModal = ({
  id,
  message = '',
  title = '',
  okLabel = 'Ok',
  cancelLabel = 'Cancel',
  isOpen,
  close,
  onConfirm,
  onClose = close,
}) => {
  return (
    <Modal
      id={id}
      data-testid="generic-confirmation-modal"
      open={isOpen}
      onClose={onClose}
      title={title}
      actions={[
        {
          id: 'generic-confirm-btn',
          label: okLabel,
          onClick: onConfirm,
        },
        {
          id: 'generic-cancel-btn',
          label: cancelLabel,
          onClick: onClose,
        },
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default GenericConfirmationModal;
