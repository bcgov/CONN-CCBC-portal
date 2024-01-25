import Modal from 'components/Modal';

/**
 * Generic Modal to show generic info messages
 */
const GenericModal = ({ id, message = '', title = '', isOpen, close }) => {
  return (
    <Modal
      id={id}
      data-testid="generic-modal"
      open={isOpen}
      onClose={close}
      title={title}
      actions={[
        {
          id: 'generic-yes-btn',
          label: 'Ok',
          onClick: close,
        },
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default GenericModal;
