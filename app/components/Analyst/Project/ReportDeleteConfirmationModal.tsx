import Modal from 'components/Modal';

const ReportDeleteConfirmationModal = ({
  id,
  modalOpen,
  reportType,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      id={id}
      open={modalOpen}
      onClose={onClose}
      title="Delete"
      actions={[
        {
          id: `btn-${reportType}-delete-modal-continue`,
          label: 'Yes, delete',
          onClick: onConfirm,
        },
        {
          id: `btn-${reportType}-delete-modal-cancel`,
          label: 'No, keep',
          variant: 'secondary',
          onClick: onClose,
        },
      ]}
    >
      <p>
        Are you sure you want to delete this {reportType} report and all
        accompanying data?
      </p>
    </Modal>
  );
};

export default ReportDeleteConfirmationModal;
