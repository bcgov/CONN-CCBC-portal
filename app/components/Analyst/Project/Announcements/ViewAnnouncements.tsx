import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { JSONSchema7 } from 'json-schema';
import Announcement from './Announcement';
import AnnouncementsHeader from './AnnouncementsHeader';
import DeleteModal from './DeleteModal';

const StyledEmpty = styled.div`
  margin: 8px 0;
`;

const StyledContainer = styled.div`
  background: #ffffff;
  position: relative;
`;

interface Props {
  ccbcNumber: any;
  announcements: any;
  style?: any;
  resetFormData?: (store: any, announcementData: any) => void;
  isFormEditMode: boolean;
  setAnnouncementData: (announcementId: string) => void;
  setFormData: (formData: JSONSchema7) => void;
  setIsFormEditMode: (isFormEditMode: boolean) => void;
}

const ViewAnnouncements: React.FC<Props> = ({
  announcements,
  isFormEditMode,
  setAnnouncementData,
  setFormData,
  setIsFormEditMode,
  style,
  resetFormData,
}) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const [toBeDeleted, setToBeDeleted] = useState(-1);
  const primaryAnnouncements = announcements.filter(
    (announcement) => announcement?.jsonData.announcementType === 'Primary'
  );

  const secondaryAnnouncements = announcements.filter(
    (announcement) => announcement?.jsonData.announcementType === 'Secondary'
  );

  const isPrimary = primaryAnnouncements.length > 0;
  const isSecondary = secondaryAnnouncements.length > 0;

  const handleDelete = (id: number) => {
    setToBeDeleted(id);
    window.history.replaceState(null, null, ' ');
    window.location.hash = 'delete-announcement';
  };
  return (
    <StyledContainer style={style}>
      <AnnouncementsHeader title="Primary news release" />
      {isPrimary ? (
        primaryAnnouncements.map((announcement) => {
          return (
            <div key={`w_${announcement.id}`}>
              <Announcement
                key={announcement.id}
                announcement={announcement}
                isFormEditMode={isFormEditMode}
                setAnnouncementData={setAnnouncementData}
                setFormData={setFormData}
                setIsFormEditMode={setIsFormEditMode}
                handleDelete={handleDelete}
              />
            </div>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <AnnouncementsHeader title="Secondary news releases" />
      {isSecondary ? (
        secondaryAnnouncements.map((announcement) => {
          return (
            <div key={`w_${announcement.id}`}>
              <Announcement
                key={announcement.id}
                announcement={announcement}
                isFormEditMode={isFormEditMode}
                setAnnouncementData={setAnnouncementData}
                setFormData={setFormData}
                setIsFormEditMode={setIsFormEditMode}
                handleDelete={handleDelete}
              />
            </div>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <DeleteModal
        id="delete-announcement"
        rowId={toBeDeleted}
        applicationId={applicationId}
        resetFormData={resetFormData}
      />
    </StyledContainer>
  );
};

export default ViewAnnouncements;
