import Button from '@button-inc/bcgov-theme/Button';

const LoginForm = () => (
  <form action="/login" method="POST">
    <Button type="submit">Login with BCeID</Button>
  </form>
);

export default LoginForm;
