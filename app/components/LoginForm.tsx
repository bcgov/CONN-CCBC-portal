import Button from '@button-inc/bcgov-theme/Button';
import { useFeature } from '@growthbook/growthbook-react';
import { IDP_HINTS, IDP_HINT_PARAM } from 'data/ssoConstants';
import styled from 'styled-components';

interface Props {
  idp: 'Basic BCeID' | 'Business BCeID' | 'IDIR';
}

const StyledForm = styled('form')`
  margin: 0;
`;

const LoginForm: React.FC<Props> = ({ idp }) => {
  const useCustomLogin = useFeature('use_custom_login').value;
  console.log(useCustomLogin);

  const action = useCustomLogin
    ? `/api/login/${IDP_HINT_PARAM}=${IDP_HINTS[idp]}`
    : `/login?${IDP_HINT_PARAM}=${IDP_HINTS[idp]}`;
  return (
    <StyledForm action={`${action}`} method="POST">
      <Button type="submit">Login with {idp}</Button>
    </StyledForm>
  );
};

export default LoginForm;
