import styled from 'styled-components'; 
import { Alert } from '@button-inc/bcgov-theme';

const StyledAlert = styled(Alert)`
  margin-bottom: 8px;
  margin-top: 8px;
  padding: 0.5em;
`;
const StyledMessage = styled('div')`
  font-weight: normal;
  font-size: small;
`;
interface Props {
  title: string;
  errorMessage: string;
}

const ImportErrorMessage: React.FC<Props> = ({ title, errorMessage }) => {
  
  return (
    <StyledAlert
      key={errorMessage}
      variant="danger"
      closable={false}
      content={
        <>
          <div> {title}</div>
          <StyledMessage>{errorMessage}</StyledMessage>
        </>
      }
    />
  );
};

export default ImportErrorMessage;
