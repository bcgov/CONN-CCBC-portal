import styled from 'styled-components';
import { useRouter } from 'next/router';
import { JSONSchema7 } from 'json-schema';
// import Announcement from './Announcement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/nextjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import AnnouncementsHeader from './AnnouncementsHeader';
import DeleteModal from './DeleteModal';

const StyledEmpty = styled.div`
  margin: 8px 0;
`;

const StyledContainer = styled.div`
  background: #ffffff;
  position: relative;
`;

const StyledAnnouncement = styled.div`
  font-family: 'BC Sans';
  font-style: normal;
  display: grid;
  grid-template-columns: 10% 50% 35% 5%;
  grid-gap: 16px;
  padding: 0px 8px;
  border-radius: 8px;
  border-width: 0px 4px;
  border-style: solid;
  border-color: #dbe6f0;
  margin-bottom: 12px;
`;

const StyledPreview = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  grid-gap: 8px;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  word-break: break-word;
  min-width: 0;
  cursor: pointer;
`;

const StyledPreviewTitleDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
`;

const StyledTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
`;

const StyledDescription = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
`;

const StyledLink = styled.a`
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #1a5a96;
`;

const StyledIconBtn = styled.button`
  & svg {
    color: ${(props) => props.theme.color.links};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.links};
  margin-bottom: '0px';
  overflow: hidden;
  max-height: 30px;
  min-width: 2em;
  transition: max-height 0.5s;

  & svg {
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const Announcement = ({
  handleDelete,
  announcement,
  preview,
  isFormEditMode,
  setAnnouncementData,
  setFormData,
  setIsFormEditMode,
}) => {
  const {
    jsonData: { announcementTitle, announcementDate, announcementUrl },
  } = announcement;

  const formattedDate = DateTime.fromJSDate(new Date(announcementDate), {
    zone: 'utc',
  }).toFormat('MMMM dd, yyyy');

  const handlePreviewClick = () => {
    window.open(announcementUrl, '_blank');
  };

  return (
    <StyledAnnouncement>
      <div>{formattedDate}</div>
      <StyledPreview onClick={handlePreviewClick}>
        <Image
          src={preview.image}
          alt={announcementTitle}
          width={300}
          height={300}
          style={{ marginRight: '8px' }}
        />

        <StyledPreviewTitleDescription>
          <StyledTitle>{preview.title}</StyledTitle>
          <StyledDescription>{preview.description}</StyledDescription>
        </StyledPreviewTitleDescription>
      </StyledPreview>
      <div>
        <div style={{ fontSize: '14px' }}>
          Other projects in this announcement
        </div>
        <div>
          {announcement.jsonData.otherProjectsInAnnouncement?.map((project) => {
            return (
              <div key={project.id}>
                <StyledLink
                  href={`/analyst/application/${project.rowId}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.ccbcNumber}
                </StyledLink>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <StyledButton
          key={`rm_${announcement.id}`}
          onClick={() => handleDelete(announcement)}
          data-testid="project-form-delete-button"
        >
          X
        </StyledButton>
        {!isFormEditMode && (
          <StyledIconBtn
            onClick={() => {
              setIsFormEditMode(true);
              setAnnouncementData({
                id: announcement.id,
                rowId: announcement.rowId,
              });
              setFormData(announcement.jsonData);
            }}
            aria-label="Edit announcement"
            data-testid="project-form-edit-button"
          >
            <FontAwesomeIcon icon={faPen} size="xs" />
          </StyledIconBtn>
        )}
      </div>
    </StyledAnnouncement>
  );
};

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

    getLinkPreview(announcements);

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
