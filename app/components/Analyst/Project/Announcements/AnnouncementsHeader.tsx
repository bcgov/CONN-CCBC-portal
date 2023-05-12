import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
}

const StyledAnnouncement = styled.div`
  clear:both;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  & svg {
    margin-right: 8px;
  }

  & h3 {
    margin-bottom: 0px;
  }
`;

const AnnouncementsHeader: React.FC<Props> = ({ title }) => {
  return (
    <StyledAnnouncement>
      <FontAwesomeIcon icon={faBullhorn} />
      <h3>{title}</h3>
    </StyledAnnouncement>
  );
};

export default AnnouncementsHeader;
