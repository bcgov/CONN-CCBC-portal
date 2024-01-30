import { useState } from 'react';
import styled from 'styled-components';

import { useArchiveApplicationMutation } from 'schema/mutations/application/archiveApplication';
import { ConnectionHandler } from 'relay-runtime';
import Modal from 'components/Modal';
import X from './XIcon';

const StyledConfirmBox = styled('div')`
  position: absolute;
  left: 40px;
  bottom: 3.5em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: #1a5a96;
  border-radius: 4px;
  color: #ffffff;
  padding: 16px 24px;

  & div:first-child {
    margin-right: 1em;
  }
`;

const ArchiveModal = ({ applications, id, isOpen, close }) => {
  const [successModal, setSuccessModal] = useState(false);
  const relayId = applications.allApplications.__id;

  const [archiveApplication] = useArchiveApplicationMutation();

  const handleArchive = async () => {
    archiveApplication({
      variables: {
        input: {
          applicationRowId: id.rowId,
        },
      },
      onCompleted: () => {
        close();
        setSuccessModal(true);
      },
      updater: (store) => {
        const connection = store.get(relayId);
        store.delete(id.id);
        ConnectionHandler.deleteNode(connection, id.id);
      },
    });
  };

  return (
    <>
      <Modal
        id="delete-application"
        open={isOpen}
        onClose={close}
        title="Delete draft"
        actions={[
          {
            id: 'archive-yes-btn',
            label: 'Yes, delete',
            onClick: handleArchive,
          },
          {
            id: 'archive-cancel-btn',
            label: 'No, keep',
            onClick: close,
            variant: 'secondary',
          },
        ]}
      >
        <p>Are you sure you want to delete this draft application?</p>
      </Modal>
      {successModal && (
        <StyledConfirmBox>
          <div>Application deleted</div>
          <button type="button" onClick={() => setSuccessModal(false)}>
            <X />
          </button>
        </StyledConfirmBox>
      )}
    </>
  );
};

export default ArchiveModal;
