import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { JSONSchema7 } from 'json-schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import AnnouncementsHeader from './AnnouncementsHeader';
import DeleteModal from './DeleteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledEmpty = styled.div`
  margin: 8px 0;
`;

const StyledContainer = styled.div`
  background: #ffffff;
  position: relative;
`;

const StyledAnnouncement = styled.div`
  display: flex;
  flex - direction: column;
  margin: 8px 0;

  ${(props) => props.theme.breakpoint.smallUp} {
  flex - direction: row;
  align - items: center;
}

  & div {
  margin - left: 16px;
}
`;
const StyledDate = styled.div`
  float:left;
  min-width:100px;
`;
const StyledIcon = styled.div`
  float:left;
  min-width:100px;
  margin-left:1em;
`;
const StyledText = styled.div`
  float:left;
  min-width:300px;
  margin-left:1em;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.links};
  margin-bottom: '0px';
  overflow: hidden;
  max-height: '30px';
  transition: max-height 0.5s;

  & svg {
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;
const Announcement = ({ announcement }) => {
  return (
    <StyledAnnouncement>
      <div>{announcementUrl}</div>
      <div>{announcementDate}</div>
      <div>&nbsp;</div>
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
      <div>&nbsp;</div>
      <div>{announcement.rowId}</div>
    </StyledAnnouncement>
  );
};

interface Props {
  announcements: any;
  style?: any;
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
}) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const [toBeDeleted, setToBeDeleted] = useState(-1);
  const primaryAnnouncements = announcements.filter(
    (announcement) => announcement.jsonData.jsonData.announcementType === 'Primary'
  );

  const secondaryAnnouncements = announcements.filter(
    (announcement) => announcement.jsonData.jsonData.announcementType === 'Secondary'
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
          return (<div key={`w_${announcement.id}`}>
            <Announcement
              key={announcement.id}
              announcement={announcement}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
            />
            <StyledButton key={`rm_${announcement.id}`}
              onClick={() => handleDelete(announcement.rowId)}
            >
            <FontAwesomeIcon
                  icon={faXmark}
                  size="sm"
                  transform="right-1"
                  color="#FFFFFF"
                /> 
        </StyledButton>
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
              announcement={announcement.jsonData}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
            />
            <StyledButton key={`rm_${announcement.id}`}
              onClick={() => handleDelete(announcement.rowId)}
            >
            <FontAwesomeIcon
                  icon={faXmark}
                  size="sm"
                  transform="right-1"
                  color="#FFFFFF"
                /> 
            </StyledButton>
            </div>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <DeleteModal id='delete-announcement' rowId={toBeDeleted} applicationId={applicationId}/>
    </StyledContainer>
  );
};

export default ViewAnnouncements;
