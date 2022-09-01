import Alert from '@button-inc/bcgov-theme/Alert';
import styled from 'styled-components';

const StyledAlert = styled(Alert)`
  margin-bottom: 20px;
  p {
    margin: 0 0.5em;
  }
`;

const IntakeAlert = () => {
  return (
    <StyledAlert size="small" variant="warning">
      <p>
        New applications will be accepted after updates to ISED&lsquo;s
        Eligibility Mapping tool are released.
      </p>
      <p>
        Please check this page after <b>September 15</b> for an update.
      </p>
    </StyledAlert>
  );
};

export default IntakeAlert;
