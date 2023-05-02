import styled from 'styled-components';
import AnnouncementsHeader from './AnnouncementsHeader';

const StyledEmpty = styled.div`
  margin: 8px 0;
`;

const StyledAnnouncement = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;

  ${(props) => props.theme.breakpoint.smallUp} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Announcement = ({ announcement }) => {
  return (
    <StyledAnnouncement>
      <div>{announcement.announcementUrl}</div>
      <div> {announcement.announcementDate}</div>
    </StyledAnnouncement>
  );
};

interface Props {
  announcements: any;
}

const ViewAnnouncements: React.FC<Props> = ({ announcements }) => {
  const primaryAnnouncements = announcements.filter(
    (announcement) => announcement.announcementType === 'Primary'
  );

  const secondaryAnnouncements = announcements.filter(
    (announcement) => announcement.announcementType === 'Secondary'
  );

  const isPrimary = primaryAnnouncements.length > 0;
  const isSecondary = secondaryAnnouncements.length > 0;

  return (
    <div>
      <AnnouncementsHeader title="Primary news release" />
      {isPrimary ? (
        primaryAnnouncements.map((announcement) => {
          return (
            <Announcement key={announcement.id} announcement={announcement} />
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
      <AnnouncementsHeader title="Secondary news releases" />
      {isSecondary ? (
        secondaryAnnouncements.map((announcement) => {
          return (
            <Announcement key={announcement.id} announcement={announcement} />
          );
        })
      ) : (
        <StyledEmpty>None</StyledEmpty>
      )}
    </div>
  );
};

export default ViewAnnouncements;
