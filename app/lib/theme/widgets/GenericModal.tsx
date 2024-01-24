import Modal from 'components/Modal';

/**
 * Generic Modal to show generic info messages
 * @param param0
 * @returns
 */
const GenericModal = ({
  id,
  message = '',
  title = '',
  modalOpen,
  setModalOpen,
}) => {
  return (
    <Modal
      id={id}
      data-testid="generic-modal"
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      title={title}
      actions={[
        {
          id: 'generic-yes-btn',
          label: 'Ok',
          onClick: () => setModalOpen(false),
        },
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default GenericModal;
