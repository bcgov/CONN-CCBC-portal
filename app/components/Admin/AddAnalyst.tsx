import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import Input from '@button-inc/bcgov-theme/Input';
import { useCreateAnalystMutation } from 'schema/mutations/analyst/createAnalyst';

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

  & div:first-child {
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

const StyledSection = styled.section`
  width: 100%;
  margin-top: 16px;
`;

const AddAnalyst: React.FC<Props> = ({ relayConnectionId }) => {
  const [showInputs, setShowInputs] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [createAnalyst] = useCreateAnalystMutation();

  const handleClick = () => {
    if (showInputs) {
      createAnalyst({
        variables: {
          connections: [relayConnectionId],
          input: { analyst: { familyName, givenName } },
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
          <Input
            type="text"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
          />
          <Input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
        </StyledInputs>
      </StyledTransition>
      <StyledButtons>
        <Button
          variant={showInputs ? 'primary' : 'secondary'}
          onClick={handleClick}
        >
          Add analyst
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
