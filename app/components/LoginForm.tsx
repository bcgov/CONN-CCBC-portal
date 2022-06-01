import StyledGovButton from './StyledGovButton';

const LoginForm = () => {
  return (
    <form action="/login" method="POST">
      <StyledGovButton type="submit">Login</StyledGovButton>
    </form>
  );
};

export default LoginForm;
