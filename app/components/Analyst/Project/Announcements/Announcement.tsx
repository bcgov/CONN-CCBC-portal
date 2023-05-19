import styled from 'styled-components';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const StyledAnnouncement = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;

  ${(props) => props.theme.breakpoint.smallUp} {
    flex-direction: row;
    align-items: center;
  }

  & div {
    margin-left: 16px;
  }
`;

const StyledDate = styled.div`
  float: left;
  min-width: 100px;
`;

const StyledIcon = styled.div`
  float: left;
  min-width: 100px;
  margin-left: 1em;
`;

const StyledIconBtn = styled.button`
  margin-left: 8px;
  & svg {
    color: ${(props) => props.theme.color.links};
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledText = styled.div`
  float: left;
  min-width: 300px;
  margin-left: 1em;
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
  isFormEditMode,
  setAnnouncementData,
  setFormData,
  setIsFormEditMode,
}) => {
  const ccbcList = announcement.jsonData?.otherProjectsInAnnouncement;
  const projectNumbers = ccbcList
    .map((project) => project.ccbcNumber)
    .join(', ');

  return (
    <StyledAnnouncement>
      <StyledDate>{announcement.jsonData?.announcementDate}</StyledDate>
      <StyledIcon>
        <Image
          src="/icons/bcid-apple-icon.svg"
          alt="Preview"
          height={100}
          width={100}
        />
      </StyledIcon>
      <StyledText>
        Canada and British Columbia invest over $20 million in infrastructure
        projects across the province to build more resilient, greener
        communities.
      </StyledText>
      <StyledText>{projectNumbers}</StyledText>
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
    </StyledAnnouncement>
  );
};

export default Announcement;
