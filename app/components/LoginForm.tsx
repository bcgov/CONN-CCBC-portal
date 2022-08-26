import Button from '@button-inc/bcgov-theme/Button';

const LoginForm = () => {
  return (
    <form action="/login" method="POST">
      <Button type="submit">Login with BCeID</Button>
    </form>
  );
};

export default LoginForm;
