import styled from 'styled-components';
import { useRouter } from 'next/router';
import { JSONSchema7 } from 'json-schema';
import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';
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
  ccbcNumber,
  isFormEditMode,
  setAnnouncementData,
  setFormData,
  setIsFormEditMode,
  style,
  resetFormData,
}) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const [toBeDeleted, setToBeDeleted] = useState({
    rowId: -1,
    jsonData: {},
  });

  const [fullAnnouncements, setFullAnnouncements] = useState([]);

  useEffect(() => {
    // need abort controller to cancel fetches when component unmounts
    let controller = new AbortController();
    let { signal } = controller;

    const getLinkPreview = async (a) => {
      try {
        // filter any nulls that might result from deleted announcements
        const filteredA = a.filter((announcement) => announcement !== null);
        const previews = await Promise.all(
          filteredA.map(async (announcement) => {
            const url = announcement?.jsonData?.announcementUrl;
            controller = new AbortController();
            signal = controller.signal;
            const response = await fetch(`/api/announcement/linkPreview`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url }),
              signal,
            });
            const preview = await response.json();
            return { ...announcement, preview };
          })
        );
        setFullAnnouncements(previews);
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    getLinkPreview(announcements).catch((error) => {
      Sentry.captureException(error);
    });

    return () => {
      controller.abort();
    };
  }, [announcements]);

  const primaryAnnouncements = fullAnnouncements.filter(
    (announcement) => announcement.jsonData.announcementType === 'Primary'
  );

  const secondaryAnnouncements = fullAnnouncements.filter(
    (announcement) => announcement.jsonData.announcementType === 'Secondary'
  );

  const isPrimary = primaryAnnouncements.length > 0;
  const isSecondary = secondaryAnnouncements.length > 0;

  const handleDelete = (announcement) => {
    setToBeDeleted({
      rowId: announcement.rowId,
      jsonData: announcement.jsonData,
    });
    window.history.replaceState(null, null, ' ');
    window.location.hash = 'delete-announcement';
  };

  return (
    <StyledContainer style={style}>
      <AnnouncementsHeader title="Primary news release" />
      {isPrimary ? (
        primaryAnnouncements.map((announcement) => {
          return (
            <Announcement
              handleDelete={handleDelete}
              key={announcement.id}
              announcement={announcement}
              preview={announcement.preview}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
            />
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <AnnouncementsHeader title="Secondary news releases" />
      {isSecondary ? (
        secondaryAnnouncements.map((announcement) => {
          return (
            <Announcement
              handleDelete={handleDelete}
              key={announcement.id}
              announcement={announcement}
              preview={announcement.preview}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
            />
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <DeleteModal
        id="delete-announcement"
        currentApplicationCcbcNumber={ccbcNumber}
        announcement={toBeDeleted}
        applicationId={applicationId}
        resetFormData={resetFormData}
      />
    </StyledContainer>
  );
};

export default ViewAnnouncements;
