import { useState } from 'react';
import styled from 'styled-components';
import { useWithdrawApplicationMutation } from 'schema/mutations/application/withdrawApplication';
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

const WithdrawModal = ({ application, setApplication, isOpen, close }) => {
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
        close();
      },

      updater: (store) => {
        store.get(application?.id).setValue('status', 'withdrawn');
      },
    });
  };

  return (
    <>
      <Modal
        id="withdraw-modal"
        open={isOpen}
        onClose={close}
        size="sm"
        title="Withdraw application"
        actions={[
          {
            id: 'withdraw-yes-btn',
            label: 'Yes, withdraw',
            onClick: () => handleWithdraw(),
          },
          {
            id: 'withdraw-no-btn',
            label: 'No, keep',
            onClick: close,
            variant: 'secondary',
          },
        ]}
      >
        <p>
          Applications submitted are deemed as property of BC. Withdrawing this
          application will remove it from consideration for Connecting
          Communities BC funding program. You will not be able to re-submit the
          application. If you would like to re-submit, you must start a new
          application.
        </p>
        <p>
          You cannot undo this action. Are you sure you want to withdraw this
          application?
        </p>
      </Modal>
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
