import { useState } from 'react';
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

const LoginForm: React.FC<Props> = ({ linkText, action }) => {
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = () => {
    setDisabled(true);
    sessionStorage.removeItem('dashboard_scroll_position');
    // do not call e.preventDefault(); unless you want to stop submission/login/logout
  };
  return (
    <StyledForm action={action} method="POST" onSubmit={handleSubmit}>
      <StyledButton
        type="submit"
        data-button-id={`${linkText}-button`}
        disabled={disabled}
      >
        {linkText}
      </StyledButton>
    </StyledForm>
  );
};

export default LoginForm;
