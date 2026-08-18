import { useState } from 'react';
import { Switch, TableRow, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useUpdateFeatureFlagMutation } from 'schema/mutations/featureFlag/updateFeatureFlag';
import {
  StatusChip,
  StyledCell,
  StyledValueCell,
} from './FeatureFlagStyledCells';

interface FeatureFlag {
  id: string;
  flagKey: string;
  isEnabled: boolean;
  value: unknown;
  description: string;
}

interface Props {
  featureFlag: FeatureFlag;
}

const valueToText = (value: unknown) =>
  value == null ? '' : JSON.stringify(value);

const StyledEdit = styled.button`
  color: ${({ theme }) => theme.color.links};

  &:hover {
    opacity: 0.7;
  }
`;

const StyledActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledSave = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.color.success};

  &:hover:not(:disabled) {
    opacity: 0.7;
  }

  &:disabled {
    color: ${({ theme }) => theme.color.disabledGrey};
    cursor: not-allowed;
  }
`;

const StyledCancel = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.color.error};

  &:hover:not(:disabled) {
    opacity: 0.7;
  }

  &:disabled {
    color: ${({ theme }) => theme.color.disabledGrey};
    cursor: not-allowed;
  }
`;

const FeatureFlagListRow: React.FC<Props> = ({ featureFlag }) => {
  const { id, flagKey, isEnabled, value, description } = featureFlag;
  const [updateFeatureFlag, isUpdateInFlight] = useUpdateFeatureFlagMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formIsEnabled, setFormIsEnabled] = useState(isEnabled);
  const [formValueText, setFormValueText] = useState(valueToText(value));
  const [formDescription, setFormDescription] = useState(description ?? '');
  const [valueError, setValueError] = useState<string | null>(null);

  const resetForm = () => {
    setFormIsEnabled(isEnabled);
    setFormValueText(valueToText(value));
    setFormDescription(description ?? '');
    setValueError(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleSave = () => {
    let parsedValue = null;
    if (formValueText.trim() !== '') {
      try {
        parsedValue = JSON.parse(formValueText);
      } catch (e) {
        setValueError('Value must be valid JSON');
        return;
      }
    }
    setValueError(null);

    updateFeatureFlag({
      variables: {
        input: {
          id,
          featureFlagPatch: {
            isEnabled: formIsEnabled,
            value: parsedValue,
            description: formDescription || null,
          },
        },
      },
      onCompleted: () => {
        setIsEditing(false);
      },
    });
  };

  if (!isEditing) {
    return (
      <TableRow hover>
        <StyledCell>{flagKey}</StyledCell>
        <StyledCell>
          <StatusChip
            label={isEnabled ? 'Enabled' : 'Disabled'}
            size="small"
            $isEnabled={isEnabled}
          />
        </StyledCell>
        <StyledValueCell>
          {value != null ? JSON.stringify(value) : '—'}
        </StyledValueCell>
        <StyledCell>{description}</StyledCell>
        <StyledCell>
          <StyledEdit
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${flagKey}`}
          >
            <FontAwesomeIcon icon={faPen} />
          </StyledEdit>
        </StyledCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover>
      <StyledCell>{flagKey}</StyledCell>
      <StyledCell>
        <Switch
          checked={formIsEnabled}
          onChange={(event) => setFormIsEnabled(event.target.checked)}
          inputProps={{ 'aria-label': `Toggle ${flagKey}` }}
        />
      </StyledCell>
      <StyledValueCell>
        <TextField
          size="small"
          fullWidth
          multiline
          value={formValueText}
          onChange={(event) => setFormValueText(event.target.value)}
          error={!!valueError}
          helperText={valueError}
        />
      </StyledValueCell>
      <StyledCell>
        <TextField
          size="small"
          fullWidth
          multiline
          value={formDescription}
          onChange={(event) => setFormDescription(event.target.value)}
        />
      </StyledCell>
      <StyledCell>
        <StyledActions>
          <StyledSave
            onClick={handleSave}
            disabled={isUpdateInFlight}
            aria-label={`Save ${flagKey}`}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save
          </StyledSave>
          <StyledCancel
            onClick={handleCancel}
            disabled={isUpdateInFlight}
            aria-label={`Cancel editing ${flagKey}`}
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancel
          </StyledCancel>
        </StyledActions>
      </StyledCell>
    </TableRow>
  );
};

export default FeatureFlagListRow;
