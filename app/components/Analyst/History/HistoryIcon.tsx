import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faDotCircle,
  faCheckDouble,
  faClipboardList,
  faEnvelope,
  faPaperclip,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

const StyledIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  width: 24px;
  height: 24px;
  background: ${(props) => props.theme.color.white};
  border: 1px solid #dcdcdc;
  border-radius: 6px;
`;

const iconMap = {
  status: faDotCircle,
  application: faClipboardList,
  rfi: faEnvelope,
  rfiApplication: faPaperclip,
  assessments: faCheckDouble,
  lead: faUser,
  package: faBox,
};
interface Props {
  type: string;
}

const HistoryIcon: React.FC<Props> = ({ type }) => {
  return (
    <StyledIcon>
      <FontAwesomeIcon icon={iconMap[type]} color="#1A5A96" />
    </StyledIcon>
  );
};

export default HistoryIcon;
