import Image from 'next/image';
import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.color.primaryYellow};
`;

const TwoColumnDiv = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: center;
`;

const CbcStatusInformation = () => {
  const infoGraphicUrl = '/images/cbcStateMachine.svg';

  return (
    <>
      <div>
        <a href={infoGraphicUrl} target="_blank" rel="noopener noreferrer">
          <Image
            src={infoGraphicUrl}
            alt="The happy path for a project until its completion. The external status is the only status applicable to a CBC project. Once the project is in the Connectivity portal, it will start at Conditionally Approved. From there it can continue to Funding Agreement Signed, Agreement Signed, Final Report Delivered, and finally Reporting Complete."
            width={1000}
            height={140}
          />
        </a>
      </div>
      <div style={{ paddingBottom: '16px', maxWidth: '1000px' }}>
        <StyledIcon data-testid="light-bulb-icon" icon={faLightbulb} />{' '}
        <span>
          The internal status for CBC projects mirrors the external status and
          changes in sync with external status. It was introduced to enhance
          dashboard filtering and usability.
        </span>
      </div>
      <div style={{ paddingBottom: '8px' }}>
        <span style={{ fontWeight: 800 }}>Other Statuses</span>
      </div>
      <TwoColumnDiv>
        <Chip
          label="Withdrawn"
          sx={{
            bgcolor: '#E8E8E8',
            color: '#414141',
            fontFamily: 'BCSans, Verdana, Arial, sans-serif',
          }}
        />
        <span>Applicant has withdrawn their submitted application</span>
      </TwoColumnDiv>
    </>
  );
};

export default CbcStatusInformation;
