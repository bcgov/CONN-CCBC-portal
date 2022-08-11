import { useState } from 'react';
import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';
import { X } from '.';
import { useUpdateApplicationMutation } from '../../schema/mutations/application/updateApplication';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
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

const WithdrawModal = ({ id }) => {
  const [successModal, setSuccessModal] = useState(false);

  const [updateApplication] = useUpdateApplicationMutation();

  const handleWithdraw = async () => {
    updateApplication({
      variables: {
        input: {
          applicationPatch: {
            status: 'withdrawn',
          },
          id: id,
        },
      },
      debounceKey: id,
      onCompleted: () => setSuccessModal(true),
    });
  };

  return (
    <>
      <StyledModal id="modal-id">
        <Modal.Header>
          Withdraw application
          <Modal.Close>
            <X />
          </Modal.Close>
        </Modal.Header>
        <Modal.Content>
          <p>
            Applications submitted are deemed as property of BC. Withdrawing
            this application will remove it from consideration for Connection
            Communities BC funding program. You will not be able to re-submit
            the application. If you would like to re-submit, you must start a
            new application.
          </p>
          <p>
            You cannot undo this action. Are you sure you want to withdraw this
            application?
          </p>
          <ModalButtons>
            <Modal.Close>
              <Button onClick={handleWithdraw}>Yes, withdraw</Button>
            </Modal.Close>

            <Modal.Close>
              <Button variant="secondary">No, keep this application</Button>
            </Modal.Close>
          </ModalButtons>
        </Modal.Content>
      </StyledModal>
      {successModal && (
        <StyledConfirmBox>
          <div>Application withdrawn</div>
          <button onClick={() => setSuccessModal(false)}>
            <X />
          </button>
        </StyledConfirmBox>
      )}
    </>
  );
};

export default WithdrawModal;
