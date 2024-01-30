import { useDeleteAnnouncementMutation } from 'schema/mutations/project/deleteAnnouncement';
import Modal from 'components/Modal';

const AnnouncementDeleteModal = ({
  id,
  isOpen,
  close,
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
    close();
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
    close();
  };

  return (
    <Modal
      id={id}
      open={isOpen}
      size="md"
      onClose={close}
      title="Delete Announcement"
      actions={[
        ...(isMultiProject
          ? [
              {
                id: 'delete-from-all-btn',
                label: 'Delete from all projects',
                onClick: handleDeleteAll,
              },
            ]
          : []),
        {
          id: 'delete-from-this-btn',
          label: isMultiProject ? `Remove from this project` : `Yes, delete`,
          onClick: handleDeleteOne,
        },
        {
          id: 'cancel-from-this-btn',
          label: isMultiProject ? 'Cancel' : 'No, Cancel',
          variant: 'secondary',
          onClick: close,
        },
      ]}
    >
      {isMultiProject ? (
        <p>
          Would you like to delete this announcement from all projects that are
          linked or remove it from just this project?
        </p>
      ) : (
        <p>Are you sure you want to delete this announcement?</p>
      )}
    </Modal>
  );
};

export default AnnouncementDeleteModal;
