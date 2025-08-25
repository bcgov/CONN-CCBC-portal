import styled from 'styled-components';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

interface StyledPreviewProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

interface StyledLinkProps {
  children?: React.ReactNode;
  href?: string;
  rel?: string;
  target?: string;
}

interface StyledIconBtnProps {
  children?: React.ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
}

interface StyledButtonProps {
  children?: React.ReactNode;
  key?: string;
  onClick?: () => any;
  'data-testid'?: string;
}

const StyledAnnouncement = styled.div`
  font-style: normal;
  display: grid;
  grid-template-columns: 10% 50% 33% 7%;
  grid-gap: 16px;
  padding: 0px 8px;
  border-radius: 8px;
  border-width: 0px 4px;
  border-style: solid;
  border-color: #dbe6f0;
  margin-bottom: 12px;
`;

const StyledPreview = styled.div<StyledPreviewProps>`
  display: grid;
  grid-template-columns: 20% 80%;
  grid-gap: 8px;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  word-break: break-word;
  min-width: 0;
  cursor: pointer;

  & img {
    border-radius: 8px;
    padding: 1px;
    object-fit: contain;
  }
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDescription = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledLink = styled.a<StyledLinkProps>`
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #1a5a96;
`;

const StyledIconBtn = styled.button<StyledIconBtnProps>`
  font-size: 16px;
  margin-right: 8px;
  cursor: pointer;
  & svg {
    color: ${(props) => props.theme.color.links};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledButton = styled.button<StyledButtonProps>`
  font-size: 16px;
  font-weight: 900;
  color: red;
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
  currentCCBCNumber,
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
          width={120}
          height={100}
          style={{ marginRight: '8px', marginBottom: 0 }}
        />

        <StyledPreviewTitleDescription>
          <StyledTitle>{preview.title || announcementUrl}</StyledTitle>
          <StyledDescription>{preview.description}</StyledDescription>
        </StyledPreviewTitleDescription>
      </StyledPreview>
      <div>
        <div style={{ fontSize: '14px' }}>
          Other projects in this announcement
        </div>
        <div>
          {announcement.jsonData.otherProjectsInAnnouncement?.map((project) => {
            return project.ccbcNumber === currentCCBCNumber ? null : (
              <div key={project.id}>
                <StyledLink
                  href={`/analyst/application/${project.rowId}/project?section=announcements`}
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
        {!isFormEditMode && (
          <StyledIconBtn
            onClick={() => {
              setIsFormEditMode(true);
              setAnnouncementData({
                id: announcement.id,
                rowId: announcement.rowId,
              });
              setFormData({ ...announcement.jsonData, previewed: false });
            }}
            aria-label="Edit announcement"
            data-testid="project-form-edit-button"
          >
            <FontAwesomeIcon icon={faPen} size="xs" />
          </StyledIconBtn>
        )}
        <StyledButton
          key={`rm_${announcement.id}`}
          onClick={() => handleDelete(announcement)}
          data-testid="project-form-delete-button"
        >
          X
        </StyledButton>
      </div>
    </StyledAnnouncement>
  );
};

export default Announcement;
