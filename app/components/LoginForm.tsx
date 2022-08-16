import StyledGovButton from './StyledGovButton';

const LoginForm = () => {
  return (
    <form action="/login" method="POST">
      <StyledGovButton type="submit">Login with BCeID</StyledGovButton>
    </form>
  );
};

export default LoginForm;
