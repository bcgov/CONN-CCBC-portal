import styled from 'styled-components';
import { JSONSchema7 } from 'json-schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import AnnouncementsHeader from './AnnouncementsHeader';
import { useDeleteAnnouncementMutation } from 'schema/mutations/project/deleteAnnouncement';

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
  const [deleteAnnouncement, isDeletingAnnouncement] = useDeleteAnnouncementMutation();
  const primaryAnnouncements = announcements.filter(
    (announcement) => announcement.jsonData.jsonData.announcementType === 'Primary'
  );

  const secondaryAnnouncements = announcements.filter(
    (announcement) => announcement.jsonData.jsonData.announcementType === 'Secondary'
  );

  const isPrimary = primaryAnnouncements.length > 0;
  const isSecondary = secondaryAnnouncements.length > 0;

  const handleDelete = (id: number) => {
    const variables = {
      input: { 
        _announcementId: id,
      },
    };
    deleteAnnouncement({
      variables,
      onError: (res) => {
        console.log(res);
      },
      onCompleted: (res) => {
        // refresh?
        console.log('success'); 
        console.log(res);
      },
    });
  };
  return (
    <StyledContainer style={style}>
      <AnnouncementsHeader title="Primary news release" />
      {isPrimary ? (
        primaryAnnouncements.map((announcement) => {
          return (<>
            <Announcement
              key={announcement.id}
              announcement={announcement}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
            />
            <StyledButton 
              onClick={() => handleDelete(announcement.rowId)}
            >
          <span>x</span> 
        </StyledButton>
            </>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <AnnouncementsHeader title="Secondary news releases" />
      {isSecondary ? (
        secondaryAnnouncements.map((announcement) => {
          return (
            <>
            <Announcement
              key={announcement.id}
              announcement={announcement.jsonData}
              isFormEditMode={isFormEditMode}
              setAnnouncementData={setAnnouncementData}
              setFormData={setFormData}
              setIsFormEditMode={setIsFormEditMode}
            />
            <StyledButton 
              onClick={() => handleDelete(announcement.rowId)}
            >
            <span>x</span> 
            </StyledButton>
            </>
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
    </StyledContainer>
  );
};

export default ViewAnnouncements;
