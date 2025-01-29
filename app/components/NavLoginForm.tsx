import styled from 'styled-components';

const StyledButton = styled.button`
  color: white;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.8em;
`;

const StyledForm = styled.form`
  margin: 0 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  linkText: string;
  action: string;
};

const LoginForm: React.FC<Props> = ({ linkText, action }) => (
  <StyledForm action={action} method="POST">
    <StyledButton
      type="submit"
      data-button-id={`${linkText}-button`}
      onClick={() => sessionStorage.removeItem('dashboard_scroll_position')}
    >
      {linkText}
    </StyledButton>
  </StyledForm>
);

export default LoginForm;
