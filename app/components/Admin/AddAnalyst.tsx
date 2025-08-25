import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { useCreateAnalystMutation } from 'schema/mutations/analyst/createAnalyst';
import { FormBase } from 'components/Form';
import { IChangeEvent } from '@rjsf/core';
import analyst from 'formSchema/admin/analyst';
import analystUiSchema from 'formSchema/uiSchema/admin/analystUiSchema';

interface Props {
  relayConnectionId: string;
}

interface TransistionProps {
  children: React.ReactNode;
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

const StyledTransition = styled.div<TransistionProps>`
  overflow: ${(props) => (props.show ? 'visible' : 'hidden')};
  transition:
    max-height 0.5s,
    opacity 0.3s ease-in-out;
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
  const [formData, setFormData] = useState({});
  const [createAnalyst] = useCreateAnalystMutation();

  const resetForm = () => {
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showInputs) {
      createAnalyst({
        variables: {
          connections: [relayConnectionId],
          input: { analyst: formData },
        },
        onCompleted: () => {
          setShowInputs(false);
          resetForm();
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
        <FormBase
          formData={formData}
          onChange={(e: IChangeEvent) => setFormData({ ...e.formData })}
          schema={analyst}
          uiSchema={analystUiSchema as any}
          onSubmit={handleSubmit}
          // Pass children to hide submit button
          // eslint-disable-next-line react/no-children-prop
          children
        />
      </StyledTransition>
      <StyledButtons>
        <Button
          variant={showInputs ? 'primary' : 'secondary'}
          onClick={handleSubmit}
        >
          {showInputs ? 'Add' : 'Add analyst'}
        </Button>
        {showInputs && (
          <Button
            variant="secondary"
            onClick={() => {
              setShowInputs(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
        )}
      </StyledButtons>
    </StyledSection>
  );
};

export default AddAnalyst;
