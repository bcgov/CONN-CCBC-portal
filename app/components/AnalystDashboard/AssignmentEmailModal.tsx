import Modal from 'components/Modal';
import { useCreateEmailNotificationsMutation } from 'schema/mutations/application/createEmailNotifications';
import { useToast } from 'components/AppProvider';
import { useState } from 'react';
import reportClientError from 'lib/helpers/reportClientError';

interface Props {
  isOpen: boolean;
  cancelLabel?: string;
  description?: string | React.ReactNode;
  id?: string;
  onCancel?: Function;
  onSave: Function;
  saveLabel?: string;
  title?: string;
  assignments: any[];
}

const AssignmentEmailModal: React.FC<Props> = ({
  isOpen,
  cancelLabel = 'Cancel',
  id = 'change-modal',
  onCancel = () => {},
  onSave,
  saveLabel = 'Save',
  assignments = [],
}) => {
  const [createEmailNotifications] = useCreateEmailNotificationsMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast, hideToast } = useToast();

  const analystsToNotify = Array.from(
    new Set(assignments.map((assignment) => assignment.assignedTo))
  ).join(', ');

  const saveEmailNotificationRecords = (
    emailRecordResults: any[],
    notifications: any[]
  ) => {
    const emailRecords = emailRecordResults.map((emailRecord, i) => ({
      messageId: emailRecord.messageId,
      toEmail: emailRecord.to,
      ccEmail: emailRecord.cc,
      jsonData: { contexts: emailRecord.context },
      notifications: notifications[i].map((notification) => ({
        applicationId: notification.applicationId,
        notificationType: `assignment_${notification.assessmentType}`,
        jsonData: {
          to: notification.assignedTo,
        },
      })),
    }));
    createEmailNotifications({
      variables: {
        input: {
          emailRecords,
        },
        connections: assignments.map((email) => email.notificationConnectionId),
      },
      onError: (error) => {
        reportClientError(error, {
          source: 'assignment-email-notification-records',
          metadata: { message: error.message },
        });
      },
    });
  };

  const notifyAnalysts = async () => {
    setIsLoading(true);
    hideToast();
    try {
      const response = await fetch('/api/email/assessmentAssigneeChange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: '',
          host: window.location.origin,
          params: { assignments },
        }),
      });
      const { emailRecordResults, details } = await response.json();
      saveEmailNotificationRecords(
        emailRecordResults,
        Object.values(details.assessmentsGrouped)
      );
      showToast('Email notification sent successfully', 'success', 5000);
    } catch (error) {
      reportClientError(error, {
        source: 'assignment-email-send',
        metadata: { message: error.message },
      });
      showToast(
        'Email notification did not work, please try again',
        'error',
        5000
      );
    } finally {
      setIsLoading(false);
      onSave();
    }
  };

  return (
    <Modal
      id={id}
      open={isOpen}
      onClose={onCancel}
      title="Send email notifications?"
      actions={[
        {
          id: 'email-confirm-btn',
          isLoading,
          label: saveLabel,
          onClick: async () => {
            notifyAnalysts();
          },
        },
        {
          id: 'email-cancel-btn',
          label: cancelLabel,
          onClick: () => onCancel(),
          disabled: isLoading,
          variant: 'secondary',
        },
      ]}
    >
      <p>
        Are you sure you want to send email notifications to those who have been
        newly assigned assessments?. <br /> Email(s) will be sent to{' '}
        {analystsToNotify}
      </p>
    </Modal>
  );
};

export default AssignmentEmailModal;
