import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import Input from '@button-inc/bcgov-theme/Input';
import { useCreateAnalystMutation } from 'schema/mutations/analyst/createAnalyst';
import { InputLabel } from '@mui/material';

interface Props {
  relayConnectionId: string;
}

interface TransistionProps {
  show: boolean;
}

const StyledButtons = styled.div`
  display: flex;

  & button {
    white-space: nowrap;
  }

  & button:first-child {
    margin-right: 16px;
  }
`;

const StyledInputs = styled.div`
  display: flex;
  margin-bottom: 16px;

  & div:first-child,
  & div:nth-child(2) {
    margin-right: 16px;
  }
`;

const StyledTransition = styled.div<TransistionProps>`
  overflow: ${(props) => (props.show ? 'visible' : 'hidden')};
  transition: max-height 0.5s, opacity 0.3s ease-in-out;
  transition-delay: 0.1s;
  opacity: ${(props) => (props.show ? 1 : 0)};

  max-height: ${(props) => (props.show ? '120px' : '0px')};
`;

const StyledSection = styled.form`
  width: 100%;
  margin-top: 16px;
`;

const AddAnalyst: React.FC<Props> = ({ relayConnectionId }) => {
  const [showInputs, setShowInputs] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [email, setEmail] = useState('');
  const [createAnalyst] = useCreateAnalystMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showInputs) {
      createAnalyst({
        variables: {
          connections: [relayConnectionId],
          input: { analyst: { familyName, givenName, email } },
        },
        onCompleted: () => {
          setShowInputs(false);
        },
      });
    } else {
      setShowInputs(true);
    }
  };

  return (
    <StyledSection>
      <StyledTransition show={showInputs}>
        <h4>New analyst</h4>
        <StyledInputs>
          <div>
            <InputLabel htmlFor="givenName">Given Name</InputLabel>
            <Input
              name="givenName"
              type="text"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
            />
          </div>
          <div>
            <InputLabel htmlFor="familyName">Family Name</InputLabel>
            <Input
              name="familyName"
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
          <div>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </StyledInputs>
      </StyledTransition>
      <StyledButtons>
        <Button
          variant={showInputs ? 'primary' : 'secondary'}
          onClick={handleSubmit}
        >
          {showInputs ? 'Add' : 'Add analyst'}
        </Button>
        {showInputs && (
          <Button variant="secondary" onClick={() => setShowInputs(false)}>
            Cancel
          </Button>
        )}
      </StyledButtons>
    </StyledSection>
  );
};

export default AddAnalyst;
