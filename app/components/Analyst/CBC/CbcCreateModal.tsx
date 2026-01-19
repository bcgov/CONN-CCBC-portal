import styled from 'styled-components';
import { useState } from 'react';
import Modal from 'components/Modal';
import reportClientError from 'lib/helpers/reportClientError';
import CbcCreateForm from './CbcCreateForm';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CbcCreateModal = ({ isOpen, setIsOpen }) => {
  const baseFormData = {
    projectId: '',
    projectTitle: '',
    externalStatus: '',
    projectType: '',
  };
  const [formData, setFormData] = useState(baseFormData);
  const [errors, setErrors] = useState<{
    projectId?: string;
    projectTitle?: string;
    externalStatus?: string;
    projectType?: string;
    submit?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: {
      projectId?: string;
      projectTitle?: string;
      externalStatus?: string;
      projectType?: string;
      submit?: string;
    } = {};

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'Project title is required';
    }

    if (!formData.externalStatus) {
      newErrors.externalStatus = 'External status is required';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await fetch('/api/cbc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: formData.projectId,
            projectTitle: formData.projectTitle,
            externalStatus: formData.externalStatus,
            projectType: formData.projectType,
          }),
        });
        const response = await result.json();
        if (response.error) {
          setIsSubmitting(false);
          if (response.error?.[0]?.message.includes('duplicate key')) {
            setErrors({ projectId: 'Project ID already exists' });
          } else {
            setErrors({
              submit: 'An error occurred while submitting the form',
            });
          }
        } else {
          window.location.href = `/analyst/cbc/${response.rowId}?recent=true`;
        }
      } catch (error) {
        setErrors({ submit: 'An error occurred while submitting the form' });
        setIsSubmitting(false);
        reportClientError(error, { source: 'cbc-create' });
      }
    }
  };

  return (
    <Modal
      id="create-cbc-form-modal"
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setFormData(baseFormData);
        setErrors({});
      }}
      title="Create CBC Project"
      actions={[
        {
          id: 'create-cbc-form-modal-save-btn',
          label: 'Save and Continue',
          onClick: handleSubmit,
          disabled: isSubmitting,
        },
        {
          id: 'create-cbc-form-modal-cancel-btn',
          label: 'Cancel',
          variant: 'secondary',
          disabled: isSubmitting,
          onClick: () => {
            setIsOpen(false);
            setFormData(baseFormData);
            setErrors({});
          },
        },
      ]}
    >
      <StyledContent>
        <CbcCreateForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
        />
      </StyledContent>
    </Modal>
  );
};

export default CbcCreateModal;
