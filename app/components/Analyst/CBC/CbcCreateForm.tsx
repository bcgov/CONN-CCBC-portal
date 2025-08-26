import styled from 'styled-components';
import { Input } from '@button-inc/bcgov-theme';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
`;

interface StyledLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const StyledLabel = styled.label<StyledLabelProps>`
  font-weight: bold;
  margin-bottom: 4px;
  &::after {
    content: '*';
    color: #e71f1f;
    margin-left: 4px;
  }
`;

const StyledInput = styled(Input)`
  & input {
    width: 100%;
    margin-top: 4px;
  }
  & input:focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }
`;

interface StyledSelectProps {
  error?: boolean;
  children?: React.ReactNode;
  value?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const StyledSelect = styled.select<StyledSelectProps>`
  width: 100%;
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #606060;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }
`;

const StyledError = styled.div`
  color: #e71f1f;
  font-size: 14px;
  margin-top: 4px;
`;

const CbcCreateForm = ({ formData, errors, isSubmitting, handleChange }) => {
  const externalStatusOptions = [
    { value: '', label: 'Select status' },
    { value: 'conditionally_approved', label: 'Conditionally Approved' },
    { value: 'approved', label: 'Agreement Signed' },
    { value: 'complete', label: 'Reporting Complete' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ];

  const projectTypeOptions = [
    { value: '', label: 'Select type' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Plan', label: 'Plan' },
    { value: 'Last-Mile', label: 'Last-Mile' },
    { value: 'Last-Mile & Transport', label: 'Last-Mile & Transport' },
    { value: 'Last-Mile & Cellular', label: 'Last-Mile & Cellular' },
    { value: 'Cellular', label: 'Cellular' },
  ];

  return (
    <StyledForm>
      <div>
        <p>
          Please enter the basic project details. After saving, you will be
          redirected to the full form to complete the application.
        </p>
        <StyledLabel htmlFor="project-id">Project ID</StyledLabel>
        <StyledInput
          type="number"
          id="project-id"
          value={formData.projectId}
          onChange={handleChange('projectId')}
          placeholder="Enter project ID"
          error={errors.projectId}
          required
          disabled={isSubmitting}
        />
        {errors.projectId && <StyledError>{errors.projectId}</StyledError>}
      </div>

      <div>
        <StyledLabel htmlFor="project-title">Project Title</StyledLabel>
        <StyledInput
          type="text"
          id="project-title"
          value={formData.projectTitle}
          onChange={handleChange('projectTitle')}
          placeholder="Enter project title"
          error={errors.projectTitle}
          required
          disabled={isSubmitting}
        />
        {errors.projectTitle && (
          <StyledError>{errors.projectTitle}</StyledError>
        )}
      </div>

      <div>
        <StyledLabel htmlFor="external-status">External Status</StyledLabel>
        <StyledSelect
          value={formData.externalStatus}
          id="external-status"
          onChange={handleChange('externalStatus')}
          error={!!errors.externalStatus}
          required
          disabled={isSubmitting}
        >
          {externalStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        {errors.externalStatus && (
          <StyledError>{errors.externalStatus}</StyledError>
        )}
      </div>

      <div>
        <StyledLabel htmlFor="project-type">Project Type</StyledLabel>
        <StyledSelect
          value={formData.projectType}
          id="project-type"
          onChange={handleChange('projectType')}
          error={!!errors.projectType}
          required
          disabled={isSubmitting}
        >
          {projectTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        {errors.projectType && <StyledError>{errors.projectType}</StyledError>}
      </div>

      {errors.submit && <StyledError>{errors.submit}</StyledError>}
      <p>
        (<span style={{ color: 'red' }}>*</span>) indicates required fields
      </p>
    </StyledForm>
  );
};

export default CbcCreateForm;
