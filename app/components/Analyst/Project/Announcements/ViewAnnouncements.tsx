import styled from 'styled-components';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import useModal from 'lib/helpers/useModal';
import { RJSFSchema } from '@rjsf/utils';
import Announcement from './Announcement';
import AnnouncementsHeader from './AnnouncementsHeader';
import AnnouncementDeleteModal from './AnnouncementDeleteModal';

interface StyledEmptyProps {
  children?: React.ReactNode;
}

const StyledEmpty = styled.div<StyledEmptyProps>`
  margin: 8px 0;
`;

interface StyledContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const StyledContainer = styled.div<StyledContainerProps>`
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
  setFormData: (formData: RJSFSchema) => void;
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

  const announcementDeleteMpdal = useModal();

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
            if (announcement?.jsonData?.previewed) {
              return {
                ...announcement,
                preview: announcement?.jsonData?.preview,
              };
            }
            const url = announcement?.jsonData?.announcementUrl;
            controller = new AbortController();
            signal = controller.signal;
            const response = await fetch(`/api/announcement/linkPreview`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url,
                jsonData: announcement?.jsonData,
                rowId: announcement?.rowId,
                ccbcNumbers: announcement?.ccbcNumbers,
              }),
              signal,
            });
            const preview = await response.json();
            // set fallback in case preview request fails
            if (preview.error) {
              return {
                ...announcement,
                preview: {
                  image: '/images/noPreview.png',
                  title: null,
                  description: 'No preview available',
                },
              };
            }
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
    announcementDeleteMpdal.open();
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
              currentCCBCNumber={ccbcNumber}
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
              currentCCBCNumber={ccbcNumber}
            />
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <AnnouncementDeleteModal
        {...announcementDeleteMpdal}
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
