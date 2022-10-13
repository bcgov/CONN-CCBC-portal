import Button from '@button-inc/bcgov-theme/Button';
import { IDP_HINTS, IDP_HINT_PARAM } from 'data/ssoConstants';
import styled from 'styled-components';

interface Props {
  idp: 'Basic BCeID' | 'Business BCeID';
}

const StyledForm = styled('form')`
  margin: 0;
`;

const LoginForm: React.FC<Props> = ({ idp }) => {
  return (
    <StyledForm
      action={`/login?${IDP_HINT_PARAM}=${IDP_HINTS[idp]}`}
      method="POST"
    >
      <Button type="submit">Login with {idp}</Button>
    </StyledForm>
  );
};

export default LoginForm;
