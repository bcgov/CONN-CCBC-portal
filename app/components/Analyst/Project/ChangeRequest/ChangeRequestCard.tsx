import styled from 'styled-components';
import { DateTime } from 'luxon';
import DownloadLink from 'components/DownloadLink';

const StyledCard = styled.div`
  padding: 8px 12px;
  margin: 16px 0;
  background: ${(props) => props.theme.color.navigationLightGrey};
  border-radius: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;

  h3 {
    margin-bottom: 8px;
  }
`;

const StyledSubheader = styled.span`
  color: #757575;
  margin-bottom: 8px;
`;

const StyledFlex = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface CardProps {
  changeRequestNumber: number;
  fileData: any;
  date: string;
}

const ChangeRequestCard: React.FC<CardProps> = ({
  changeRequestNumber,
  fileData,
  date,
}) => {
  const formattedDate = DateTime.fromISO(date).toLocaleString(
    DateTime.DATE_MED
  );

  return (
    <StyledCard>
      <StyledFlex>
        <h3>Change request #{changeRequestNumber}</h3>
        <span>{formattedDate}</span>
      </StyledFlex>
      <StyledSubheader>Updated Statement of Work Excel file</StyledSubheader>
      <DownloadLink fileName={fileData?.name} uuid={fileData?.uuid} />
    </StyledCard>
  );
};

export default ChangeRequestCard;
