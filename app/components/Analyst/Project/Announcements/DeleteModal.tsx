import { useState } from 'react';
import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';
import { useDeleteAnnouncementMutation } from 'schema/mutations/project/deleteAnnouncement';

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

const XIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1L17 17" stroke="white" />
    <path d="M1 17L17 1" stroke="white" />
  </svg>
);

const DeleteModal = ({ id, rowId, applicationId }) => {
  const [successModal, setSuccessModal] = useState(false);

  const [DeleteAnnouncement] = useDeleteAnnouncementMutation();

  const handleDeleteAll = async () => {
    const variables = {
      input: { 
        _announcementId: rowId,
      },
    };
    DeleteAnnouncement({
      variables,
      onError: (res) => {
        console.log(res);
      },
      onCompleted: (res) => {
        // refresh?
        console.log('success'); 
        console.log(res);
        setSuccessModal(true)
      },
    });
  };

  const handleDeleteOne = async () => {
    const variables = {
      input: { 
        _announcementId: id,
      },
    };
    DeleteAnnouncement({
      variables,
      onError: (res) => {
        console.log(res);
      },
      onCompleted: (res) => {
        // refresh?
        console.log('success'); 
        console.log(res);
        setSuccessModal(true)
      },
    });
  };

  return (
    <>
      <StyledModal id={id}>
        <Modal.Header>
          Delete Announcement
          <Modal.Close>
            <XIcon />
          </Modal.Close>
        </Modal.Header>
        <Modal.Content>
          <p>
            Would you like to delete this announcement from all projects that are linked
            or remove it from just this project?
          </p>
          <ModalButtons>
            <Modal.Close>
              <Button onClick={handleDeleteAll} data-testid="Delete-from-all-btn">
                Delete from all projects
              </Button>
            </Modal.Close>
            <Modal.Close>
              <Button onClick={handleDeleteOne} data-testid="Delete-from-this-btn">
                Remove from this project
              </Button>
            </Modal.Close>

            <Modal.Close>
              <Button variant="secondary">Cancel</Button>
            </Modal.Close>
          </ModalButtons>
        </Modal.Content>
      </StyledModal>
      {/* {successModal && (
        <StyledConfirmBox>
          <div>Announcement Deleted</div>
          <button type="button" onClick={() => setSuccessModal(false)}>
            <XIcon />
          </button>
        </StyledConfirmBox>
      )} */}
    </>
  );
};

export default DeleteModal;
