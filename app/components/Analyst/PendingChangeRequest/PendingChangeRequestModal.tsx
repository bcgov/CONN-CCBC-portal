import React, { useState, useEffect } from 'react';
import Modal from 'components/Modal';
import pendingChangeRequestComment from 'formSchema/analyst/pendingChangeRequestComment';
import { FormBase } from 'components/Form';
import pendingChangeRequestCommentUiSchema from 'formSchema/uiSchema/analyst/pendingChangeRequestCommentUiSchema';
import styled from 'styled-components';

interface Props {
  isOpen: boolean;
  onCancel?: Function;
  onSave: Function;
  value: string;
  isHeaderEditable: boolean;
}

const StyledFormBase = styled(FormBase)`
  min-width: 600px;
`;

const PendingChangeRequestModal: React.FC<Props> = ({
  isOpen,
  onCancel = () => {},
  onSave,
  value,
  isHeaderEditable = true,
}) => {
  const [formData, setFormData] = useState({ comment: value });

  useEffect(() => {
    setFormData({ comment: value });
  }, [value]);

  return (
    <Modal
      id="pending-change-request-modal"
      open={isOpen}
      onClose={onCancel}
      size="lg"
      title="Comments on pending changes (optional)"
      actions={
        isHeaderEditable
          ? [
              {
                id: 'pending-request-change-save-btn',
                label: 'Save',
                onClick: () => onSave(formData.comment),
                disabled: value && value === formData?.comment,
              },
              {
                id: 'pending-request-change-cancel-btn',
                label: 'Cancel',
                onClick: onCancel,
                variant: 'secondary',
              },
            ]
          : []
      }
    >
      <StyledFormBase
        schema={pendingChangeRequestComment}
        uiSchema={pendingChangeRequestCommentUiSchema}
        formData={formData}
        formContext={{ skipUnsavedWarning: true }}
        onChange={(e) => setFormData(e.formData)}
        disabled={!isHeaderEditable}
        // Pass children to hide submit button
        // eslint-disable-next-line react/no-children-prop
        children
      />
    </Modal>
  );
};

export default PendingChangeRequestModal;
