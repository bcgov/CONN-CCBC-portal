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

const DeleteModal = ({ id, rowId, applicationId, resetFormData }) => {
  const [DeleteAnnouncement] = useDeleteAnnouncementMutation();

  const handleDeleteAll = async () => {
    const variables = {
      input: {
        announcementRowId: rowId,
        applicationRowId: -1,
      },
    };
    DeleteAnnouncement({
      variables,
      onError: (res) => {
        
      },
      updater: (store, data) => {
        resetFormData(store, data.deleteAnnouncement.announcement)
      }
    });
  };

  const handleDeleteOne = async () => {
    const applicationRowId = parseInt(applicationId, 10);
    const variables = {
      input: {
        announcementRowId: rowId,
        applicationRowId,
      },
    };
    DeleteAnnouncement({
      variables,
      onError: (res) => {
        
      },
      updater: (store, data) => {
        resetFormData(store, data.deleteAnnouncement.announcement)
      }
    });
  };

  return (
    <StyledModal id={id}>
      <Modal.Header>
        Delete Announcement
        <Modal.Close>
          <XIcon />
        </Modal.Close>
      </Modal.Header>
      <Modal.Content>
        <p>
          Would you like to delete this announcement from all projects that are
          linked or remove it from just this project?
        </p>
        <ModalButtons>
          <Modal.Close>
            <Button onClick={handleDeleteAll} data-testid="Delete-from-all-btn">
              Delete from all projects
            </Button>
          </Modal.Close>
          <Modal.Close>
            <Button
              onClick={handleDeleteOne}
              data-testid="Delete-from-this-btn"
            >
              Remove from this project
            </Button>
          </Modal.Close>

          <Modal.Close>
            <Button variant="secondary">Cancel</Button>
          </Modal.Close>
        </ModalButtons>
      </Modal.Content>
    </StyledModal>
  );
};

export default DeleteModal;
