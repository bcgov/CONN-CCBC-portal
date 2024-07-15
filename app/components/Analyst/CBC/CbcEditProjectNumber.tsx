import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useUpdateCbcProjectNumberMutation } from 'schema/mutations/cbc/updateCbcProjectNumber';
import styled from 'styled-components';
import { Input } from '@button-inc/bcgov-theme';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  cbc: any;
  value: number;
  isHeaderEditable: boolean;
}

const StyledH2 = styled.h2`
  margin: 0;
  font-size: 16px;
  cursor: pointer;
`;

const StyledInput = styled(Input)`
  & input {
    margin-top: 8px;
    margin-bottom: 4px;
    width: 90%;
  }
  & input:focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
`;

const StyledLoadingDiv = styled('div')`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const StyledError = styled('div')`
  color: #e71f1f;
  display: inline-block;
  margin-top: 8px;
  flex-basis: 100%;
`;

const StyledMessage = styled('div')`
  display: flex;
  &::after {
    content: '.';
    visibility: hidden;
  }
  flex-basis: 100%;
`;

const CbcEditProjectNumber: React.FC<Props> = ({
  cbc,
  value,
  isHeaderEditable,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcEditProjectNumber_query on Cbc {
        projectNumber
      }
    `,
    cbc
  );

  const [baseProjectNumber, setBaseProjectNumber] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateProjectNumber] = useUpdateCbcProjectNumberMutation();

  const [projectNumber, setProjectNumber] = useState(
    queryFragment?.projectNumber
  );

  const [error, setError] = useState(null);

  const handleSubmit = () => {
    setIsSaving(true);
    const parsedValue = parseInt(projectNumber, 10);
    if (baseProjectNumber !== parsedValue) {
      updateProjectNumber({
        variables: {
          input: {
            projectNumber: baseProjectNumber,
            cbcPatch: {
              projectNumber: parsedValue,
            },
          },
        },
        onCompleted: () => {
          setProjectNumber(parsedValue);
          setBaseProjectNumber(parsedValue);
          setIsEditing(false);
        },
        onError: (e) => {
          if (e?.message?.indexOf('duplicate key') !== -1) {
            setError('A project with this number already exists.');
          } else {
            setError(
              'An error occurred while attempting to update the project number.'
            );
          }
          setIsSaving(false);
          setIsEditing(false);
          setProjectNumber(baseProjectNumber);
        },
        debounceKey: 'cbc_change_project_number',
      });
    } else {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!error) handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setProjectNumber(value);
    }
  };

  const checkProjectNumberIsUnique = async (val) => {
    try {
      const response = await fetch('/api/validation/project-number-unique', {
        method: 'POST',
        body: JSON.stringify({ projectNumber: val }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data;
    } catch (e) {
      setError(
        'An error occurred while attempting to validate the project number.'
      );
      return false;
    }
  };

  const validateProjectNumber = async (val) => {
    setIsValidating(true);
    const parsedValue = parseInt(val, 10);
    if (Number.isNaN(parsedValue)) {
      setError('Project number must be a number.');
    } else if (val === '' || val === null) {
      setError('Project number cannot be empty.');
      // is a valid number and is not empty
    } else {
      if (parsedValue !== baseProjectNumber) {
        const isUnique = await checkProjectNumberIsUnique(parsedValue);
        if (isUnique) {
          setError(null);
        } else {
          setError('A project with this number already exists.');
        }
      }
      setIsValidating(false);
    }
    setIsValidating(false);
    setProjectNumber(val);
  };
  return (
    <StyledDiv>
      {isEditing ? (
        <>
          <StyledInput
            error={error}
            type="number"
            id="project-number-change"
            onChange={(e: { target: { value: string } }) => {
              const val = e.target.value;
              validateProjectNumber(val);
            }}
            autoFocus
            ref={(ref) => ref && ref.focus()}
            disabled={isSaving}
            placeholder="Enter project number"
            value={projectNumber ?? ''}
            size="medium"
            required
            aria-label="Project number input"
            maxLength={12}
            minLength={1}
            onBlur={() => {
              if (!error) handleSubmit();
            }}
            onKeyDown={handleKeyDown}
          />
          {(isSaving || isValidating) && (
            <StyledLoadingDiv>
              <CircularProgress size={30} />
            </StyledLoadingDiv>
          )}
        </>
      ) : (
        <StyledH2
          onClick={() => {
            if (isHeaderEditable) {
              setError(null);
              setIsEditing(true);
            }
          }}
        >
          {projectNumber}
        </StyledH2>
      )}
      {error && (
        <StyledMessage>
          {error && <StyledError>{error}</StyledError>}

          {/* {help && <Label>{help}</Label>} */}
        </StyledMessage>
      )}
    </StyledDiv>
  );
};

export default CbcEditProjectNumber;
