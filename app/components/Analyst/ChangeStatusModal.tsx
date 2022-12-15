import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';
import { useCreateApplicationStatusMutation } from 'schema/mutations/assessment/createApplicationStatus';
import XIcon from 'components/Dashboard/XIcon';

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

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 126px;
  resize: none;
  margin-top: 12px;
  margin-bottom: 16px;
`;

const ChangeStatusModal = ({
  currentStatus,
  draftStatus,
  onCancelChange,
  onSuccess,
}) => {
  const router = useRouter();
  const applicationId = Number(router.query.applicationId);
  const [changeReason, setChangeReason] = useState('');

  const [createStatus] = useCreateApplicationStatusMutation();
  const handleClick = async () => {
    createStatus({
      variables: {
        input: {
          applicationStatus: {
            applicationId,
            changeReason,
            status: draftStatus.name,
          },
        },
      },
      onCompleted: () => {
        onSuccess();
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChangeReason(e.target.value);
  };

  return (
    <StyledModal id="modal-id">
      <Modal.Header>
        Reason for change
        <Modal.Close>
          <XIcon />
        </Modal.Close>
      </Modal.Header>
      <Modal.Content>
        <p>
          You are about to change the status from {currentStatus?.description}{' '}
          to {draftStatus?.description}.
        </p>
        <div>Please provide a reason for changing the status. (optional)</div>
        <StyledTextArea
          maxLength={1000}
          onChange={handleChange}
          data-testid="reason-for-change"
        />
        <ModalButtons>
          <Modal.Close>
            <Button onClick={handleClick} data-testid="withdraw-yes-btn">
              Save change
            </Button>
          </Modal.Close>

          <Modal.Close>
            <Button
              variant="secondary"
              onClick={() => onCancelChange && onCancelChange()}
            >
              Cancel change
            </Button>
          </Modal.Close>
        </ModalButtons>
      </Modal.Content>
    </StyledModal>
  );
};

export default ChangeStatusModal;
