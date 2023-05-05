import styled from 'styled-components';
import AnnouncementsHeader from './AnnouncementsHeader';

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

const Announcement = ({ announcement }) => {
  return (
    <StyledAnnouncement>
      <div>{announcement.announcementUrl}</div>
      <div>{announcement.announcementDate}</div>
    </StyledAnnouncement>
  );
};

interface Props {
  announcements: any;
  style?: any;
}

const ViewAnnouncements: React.FC<Props> = ({ announcements, style }) => {
  const primaryAnnouncements = announcements.filter(
    (announcement) => announcement.announcementType === 'Primary'
  );

  const secondaryAnnouncements = announcements.filter(
    (announcement) => announcement.announcementType === 'Secondary'
  );

  const isPrimary = primaryAnnouncements.length > 0;
  const isSecondary = secondaryAnnouncements.length > 0;

  return (
    <StyledContainer style={style}>
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
    </StyledContainer>
  );
};

export default ViewAnnouncements;
