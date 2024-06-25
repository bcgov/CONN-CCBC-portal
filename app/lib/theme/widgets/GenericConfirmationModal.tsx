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
}) => {
  return (
    <Modal
      id={id}
      data-testid="generic-confirmation-modal"
      open={isOpen}
      onClose={close}
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
          onClick: close,
        },
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default GenericConfirmationModal;
