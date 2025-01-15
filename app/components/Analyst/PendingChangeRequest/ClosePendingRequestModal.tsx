import React, { useEffect, useState } from 'react';
import Modal from 'components/Modal';
import { FormBase } from 'components/Form';
import pendingChangeRequestCancel from 'formSchema/analyst/pendingChangeRequestCancel';
import pendingChangeRequestCancelUiSchema from 'formSchema/uiSchema/analyst/pendingChangeRequestCancelUiSchema';
import styled from 'styled-components';

interface Props {
  isOpen: boolean;
  onCancel?: Function;
  onSave: Function;
}

const StyledFormBase = styled(FormBase)`
  min-width: 350px;
  & .radio-widget {
    margin-left: ${(props) => props.theme.spacing.xlarge};
  }
`;

const ClosePendingRequestModal: React.FC<Props> = ({
  isOpen,
  onCancel = () => {},
  onSave,
}) => {
  const [formData, setFormData] = useState(null);
  useEffect(() => {
    if (isOpen) {
      setFormData(null);
    }
  }, [isOpen]);

  return (
    <Modal
      id="pending-change-request-modal"
      open={isOpen}
      onClose={onCancel}
      size="lg"
      title="Done with this change request?"
      actions={[
        {
          id: 'pending-request-change-save-btn',
          label: 'Save',
          onClick: () => onSave(formData.comment),
          disabled: !formData?.comment,
        },
        {
          id: 'pending-request-change-cancel-btn',
          label: 'No, Keep Pending',
          onClick: () => onCancel(),
          variant: 'secondary',
        },
      ]}
    >
      <StyledFormBase
        schema={pendingChangeRequestCancel}
        uiSchema={pendingChangeRequestCancelUiSchema}
        formData={formData}
        formContext={{ skipUnsavedWarning: true }}
        onChange={(e) => setFormData(e.formData)}
        // Pass children to hide submit button
        // eslint-disable-next-line react/no-children-prop
        children
      />
    </Modal>
  );
};

export default ClosePendingRequestModal;
