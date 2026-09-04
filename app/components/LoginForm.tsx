import Button from '@button-inc/bcgov-theme/Button';
import { IDP_HINTS, IDP_HINT_PARAM } from 'data/ssoConstants';
import { useRouter } from 'next/router';
import styled from 'styled-components';

interface Props {
  idp: 'Basic BCeID' | 'Business BCeID' | 'IDIR';
  loginText?: string | null;
}

const StyledForm = styled('form')`
  margin: 0;
`;

const LoginForm: React.FC<Props> = ({ idp, loginText = null }) => {
  const router = useRouter();
  const { query } = router;

  const action = query.redirect
    ? `/api/login/${IDP_HINT_PARAM}=${IDP_HINTS[idp]}?redirect=${query.redirect}`
    : `/api/login/${IDP_HINT_PARAM}=${IDP_HINTS[idp]}`;

  return (
    <StyledForm action={`${action}`} method="POST">
      <Button style={{ minWidth: '172px' }} type="submit">
        {loginText || `Login with ${idp}`}
      </Button>
    </StyledForm>
  );
};

export default LoginForm;
