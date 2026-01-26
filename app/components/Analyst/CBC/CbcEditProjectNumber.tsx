import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useUpdateCbcProjectNumberMutation } from 'schema/mutations/cbc/updateCbcProjectNumber';
import styled from 'styled-components';
import { Input } from '@button-inc/bcgov-theme';
import CircularProgress from '@mui/material/CircularProgress';
import reportClientError from 'lib/helpers/reportClientError';

interface Props {
  cbc: any;
  value: string | number;
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

  const [baseProjectNumber, setBaseProjectNumber] = useState(
    String(value ?? '')
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateProjectNumber] = useUpdateCbcProjectNumberMutation();

  const [projectNumber, setProjectNumber] = useState(
    String(queryFragment?.projectNumber ?? '')
  );

  const [error, setError] = useState(null);

  const handleSubmit = () => {
    setIsSaving(true);
    const trimmedValue = projectNumber.trim();
    if (baseProjectNumber !== trimmedValue) {
      updateProjectNumber({
        variables: {
          input: {
            projectNumber: baseProjectNumber,
            cbcPatch: {
              projectNumber: trimmedValue,
            },
          },
        },
        onCompleted: () => {
          setProjectNumber(trimmedValue);
          setBaseProjectNumber(trimmedValue);
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
          reportClientError(e, { source: 'cbc-project-number-update' });
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
      setProjectNumber(String(value));
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
      reportClientError(e, { source: 'cbc-project-number-validate' });
      return false;
    }
  };

  const validateProjectNumber = async (val) => {
    setIsValidating(true);
    const trimmedVal = val?.trim() ?? '';
    if (trimmedVal === '') {
      setError('Project number cannot be empty.');
      setIsValidating(false);
    } else {
      if (trimmedVal !== baseProjectNumber) {
        const isUnique = await checkProjectNumberIsUnique(trimmedVal);
        if (isUnique) {
          setError(null);
        } else {
          setError('A project with this number already exists.');
        }
      }
      setIsValidating(false);
    }
    setProjectNumber(val);
  };
  return (
    <StyledDiv>
      {isEditing ? (
        <>
          <StyledInput
            error={error}
            type="text"
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
        </StyledMessage>
      )}
    </StyledDiv>
  );
};

export default CbcEditProjectNumber;
