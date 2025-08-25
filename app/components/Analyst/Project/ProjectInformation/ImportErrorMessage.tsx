import styled from 'styled-components';
import { Alert } from '@button-inc/bcgov-theme';

interface StyledAlertProps {
  children?: React.ReactNode;
  variant?: string;
  closable?: boolean;
  content?: React.ReactNode;
}

const StyledAlert = styled(Alert)<StyledAlertProps>`
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
