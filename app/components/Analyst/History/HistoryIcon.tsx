import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faBullhorn,
  faChartGantt,
  faDollarSign,
  faDotCircle,
  faCheckDouble,
  faClipboardList,
  faEnvelope,
  faPaperclip,
  faStamp,
  faUser,
  faMap,
  faArrowRightArrowLeft,
  faTreeCity,
  faSignsPost,
  faWifi,
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
  application_announcement: faBullhorn,
  application_announced: faBullhorn,
  application_status: faDotCircle,
  application: faClipboardList,
  application_claims_data: faDollarSign,
  form_data: faClipboardList,
  rfi_data: faEnvelope,
  attachment: faPaperclip,
  assessment_data: faCheckDouble,
  application_analyst_lead: faUser,
  application_package: faBox,
  conditional_approval_data: faStamp,
  application_gis_data: faMap,
  project_information_data: faChartGantt,
  application_sow_data: faChartGantt,
  change_request_data: faArrowRightArrowLeft,
  application_community_progress_report_data: faTreeCity,
  application_milestone_data: faSignsPost,
  application_project_type: faWifi,
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
