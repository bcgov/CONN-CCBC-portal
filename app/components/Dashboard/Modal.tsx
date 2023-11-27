import { useState } from 'react';
import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';
import { useWithdrawApplicationMutation } from 'schema/mutations/application/withdrawApplication';
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

const StyledContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-width: 600px;
`;

const WithdrawModal = ({ application, setApplication }) => {
  const [successModal, setSuccessModal] = useState(false);
  const [withdrawApplication] = useWithdrawApplicationMutation();

  const handleWithdraw = async () => {
    withdrawApplication({
      variables: {
        input: {
          applicationRowId: application?.rowId,
        },
      },
      onCompleted: () => {
        setApplication(null);
        setSuccessModal(true);
      },

      updater: (store) => {
        store.get(application?.id).setValue('status', 'withdrawn');
      },
    });
  };

  return (
    <>
      <StyledModal id="withdraw-modal">
        <Modal.Header>
          Withdraw application
          <Modal.Close>
            <X />
          </Modal.Close>
        </Modal.Header>
        <StyledContent>
          <p>
            Applications submitted are deemed as property of BC. Withdrawing
            this application will remove it from consideration for Connected
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
              <Button onClick={handleWithdraw} data-testid="withdraw-yes-btn">
                Yes, withdraw
              </Button>
            </Modal.Close>

            <Modal.Close>
              <Button variant="secondary">No, keep</Button>
            </Modal.Close>
          </ModalButtons>
        </StyledContent>
      </StyledModal>
      {successModal && (
        <StyledConfirmBox>
          <div>Application withdrawn</div>
          <button type="button" onClick={() => setSuccessModal(false)}>
            <X />
          </button>
        </StyledConfirmBox>
      )}
    </>
  );
};

export default WithdrawModal;
