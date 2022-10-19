import Alert from '@button-inc/bcgov-theme/Alert';
import Link from '@button-inc/bcgov-theme/Link';
import styled from 'styled-components';
import { DateTime } from 'luxon';

const StyledAlert = styled(Alert)`
  margin-top: 20px;
  margin-bottom: 20px;
  p {
    margin: 0 0.5em;
  }
  a {
    font-size: 0.8rem;
  }
`;
const BoldText = styled('strong')`
  font-weight: bold;
`;

interface Props {
  dateTimestamp: string;
  variant: string;
  text: string;
  includeLink : boolean;
  displayOpenDate : boolean;
}

const DynamicAlert: React.FC<Props> = ({ dateTimestamp, variant, text, includeLink, displayOpenDate}) => {
  if (!text) return null;
  let alertText = text;
  // merge code
  if (dateTimestamp && displayOpenDate && text.indexOf("[DATE") > -1) {
    const dateString = DateTime.fromISO(dateTimestamp).toLocaleString(
      DateTime.DATE_FULL
    );
    alertText = text.replace("[DATE]", dateString);
  }

  return (
    <StyledAlert size="small" variant={variant} data-testid="custom-alert">
      <p><BoldText>{alertText}</BoldText>
      {includeLink && 
      <>
        <br />
          Please check the{' '}
          <Link href="https://www.gov.bc.ca/connectingcommunitiesbc"
            target="_blank"
            rel="noopener noreferrer">
            program webpage
          </Link>{' '}
          for updates.
      </>}
      </p>
    </StyledAlert>
  );
};

export default DynamicAlert;
