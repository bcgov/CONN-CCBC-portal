import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { Switch, TextField } from '@mui/material';
import { useCreateFeatureFlagMutation } from 'schema/mutations/featureFlag/createFeatureFlag';

interface Props {
  relayConnectionId: string;
}

const emptyForm = {
  flagKey: '',
  isEnabled: false,
  valueText: '',
  description: '',
};

const StyledContainer = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 500px;
  margin-top: 16px;
`;

const StyledSwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledButtons = styled.div`
  display: flex;
  margin-top: 16px;

  & button {
    white-space: nowrap;
  }

  & button:first-child {
    margin-right: 16px;
  }
`;

const AddFeatureFlag: React.FC<Props> = ({ relayConnectionId }) => {
  const [showInputs, setShowInputs] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [valueError, setValueError] = useState<string | null>(null);
  const [createFeatureFlag, isCreateInFlight] = useCreateFeatureFlagMutation();

  const resetForm = () => {
    setForm(emptyForm);
    setValueError(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowInputs(false);
  };

  const handleSubmit = () => {
    if (!showInputs) {
      setShowInputs(true);
      return;
    }

    let parsedValue = null;
    if (form.valueText.trim() !== '') {
      try {
        parsedValue = JSON.parse(form.valueText);
      } catch (e) {
        setValueError('Value must be valid JSON');
        return;
      }
    }
    setValueError(null);

    createFeatureFlag({
      variables: {
        connections: [relayConnectionId],
        input: {
          featureFlag: {
            flagKey: form.flagKey.trim(),
            isEnabled: form.isEnabled,
            value: parsedValue,
            description: form.description || null,
          },
        },
      },
      onCompleted: () => {
        setShowInputs(false);
        resetForm();
      },
    });
  };

  return (
    <StyledContainer>
      {showInputs && (
        <StyledForm>
          <TextField
            label="Flag key"
            size="small"
            required
            value={form.flagKey}
            onChange={(e) => setForm({ ...form, flagKey: e.target.value })}
          />
          <StyledSwitchRow>
            <span>Enabled</span>
            <Switch
              checked={form.isEnabled}
              onChange={(e) =>
                setForm({ ...form, isEnabled: e.target.checked })
              }
              inputProps={{ 'aria-label': 'Enabled' }}
            />
          </StyledSwitchRow>
          <TextField
            label="Value (JSON)"
            size="small"
            multiline
            value={form.valueText}
            onChange={(e) => setForm({ ...form, valueText: e.target.value })}
            error={!!valueError}
            helperText={valueError}
          />
          <TextField
            label="Description"
            size="small"
            multiline
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </StyledForm>
      )}
      <StyledButtons>
        <Button
          variant={showInputs ? 'primary' : 'secondary'}
          onClick={handleSubmit}
          disabled={isCreateInFlight || (showInputs && !form.flagKey.trim())}
        >
          {showInputs ? 'Add' : 'Add flag'}
        </Button>
        {showInputs && (
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isCreateInFlight}
          >
            Cancel
          </Button>
        )}
      </StyledButtons>
    </StyledContainer>
  );
};

export default AddFeatureFlag;
