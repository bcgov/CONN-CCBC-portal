import styled from 'styled-components';
import AnnouncementsHeader from './AnnouncementsHeader';

const StyledEmpty = styled.div`
  margin: 8px 0;
`;
const ViewAnnouncements = () => {
  return (
    <div>
      <AnnouncementsHeader title="Primary news release" />
      <StyledEmpty>None</StyledEmpty>
      <AnnouncementsHeader title="Secondary news releases" />
      <StyledEmpty>None</StyledEmpty>
    </div>
  );
};

export default ViewAnnouncements;
