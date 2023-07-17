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

const DeleteModal = ({
  id,
  announcement,
  applicationId,
  currentApplicationCcbcNumber,
  resetFormData,
}) => {
  const [DeleteAnnouncement] = useDeleteAnnouncementMutation();
  const { rowId, jsonData } = announcement;
  const isMultiProject = jsonData.otherProjectsInAnnouncement?.length > 1;

  const handleDeleteAll = async () => {
    const variables = {
      input: {
        announcementRowId: rowId,
        applicationRowId: -1,
        formData: jsonData,
      },
    };

    DeleteAnnouncement({
      variables,
      updater: (store, data) => {
        resetFormData(store, data.deleteAnnouncement.announcement);
      },
    });
  };

  const handleDeleteOne = async () => {
    // Remove the current application from the list of projects
    const updatedProjectData = jsonData.otherProjectsInAnnouncement?.filter(
      (project) => {
        return project.ccbcNumber !== currentApplicationCcbcNumber;
      }
    );
    const newFormData = {
      ...jsonData,
      otherProjectsInAnnouncement: updatedProjectData,
    };

    const applicationRowId = parseInt(applicationId, 10);
    const variables = {
      input: {
        announcementRowId: rowId,
        applicationRowId,
        formData: newFormData,
      },
    };
    DeleteAnnouncement({
      variables,
      updater: (store, data) => {
        resetFormData(store, data.deleteAnnouncement.announcement);
      },
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
        {isMultiProject ? (
          <p>
            Would you like to delete this announcement from all projects that
            are linked or remove it from just this project?
          </p>
        ) : (
          <p>Are you sure you want to delete this announcement?</p>
        )}
        <ModalButtons>
          {isMultiProject && (
            <Modal.Close>
              <Button
                onClick={handleDeleteAll}
                data-testid="delete-from-all-btn"
              >
                Delete from all projects
              </Button>
            </Modal.Close>
          )}
          <Modal.Close>
            <Button
              onClick={handleDeleteOne}
              data-testid="delete-from-this-btn"
            >
              {isMultiProject ? `Remove from this project` : `Yes, delete`}
            </Button>
          </Modal.Close>
          <Modal.Close>
            <Button variant="secondary">
              {!isMultiProject && `No, `}Cancel
            </Button>
          </Modal.Close>
        </ModalButtons>
      </Modal.Content>
    </StyledModal>
  );
};

export default DeleteModal;
