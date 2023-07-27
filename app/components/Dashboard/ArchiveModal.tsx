import { useState } from 'react';
import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';

import { useArchiveApplicationMutation } from 'schema/mutations/application/archiveApplication';
import X from './XIcon';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  z-index: 2;
`;

const ModalButtons = styled('div')`
  & button {
    margin-right: 1em;
  }
`;

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

const ArchiveModal = ({ id }) => {
  const [successModal, setSuccessModal] = useState(false);

  const [archiveApplication] = useArchiveApplicationMutation();

  const handleWithdraw = async () => {
    archiveApplication({
      variables: {
        input: {
          applicationRowId: id,
        },
      },
      onCompleted: () => setSuccessModal(true),
    });
  };

  return (
    <>
      <StyledModal id="delete-application">
        <Modal.Header>
          Delete draft
          <Modal.Close>
            <X />
          </Modal.Close>
        </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this draft application?</p>
          <ModalButtons>
            <Modal.Close>
              <Button onClick={handleWithdraw} data-testid="archive-yes-btn">
                Yes, delete
              </Button>
            </Modal.Close>

            <Modal.Close>
              <Button variant="secondary">No, keep</Button>
            </Modal.Close>
          </ModalButtons>
        </Modal.Content>
      </StyledModal>
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
