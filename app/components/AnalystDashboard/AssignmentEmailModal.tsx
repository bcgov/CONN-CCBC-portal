import Modal from 'components/Modal';
import * as Sentry from '@sentry/nextjs';
import { useCreateEmailNotificationsMutation } from 'schema/mutations/application/createEmailNotifications';

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
        Sentry.captureException({
          name: 'Save Email Notification Records Error',
          message: error.message,
        });
      },
    });
  };

  const notifyAnalysts = async () => {
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
    } catch (error) {
      Sentry.captureException({
        name: 'Notify Analysts Error',
        message: error.message,
      });
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
          label: saveLabel,
          onClick: async () => {
            notifyAnalysts();
            onSave();
          },
        },
        {
          id: 'email-cancel-btn',
          label: cancelLabel,
          onClick: () => onCancel(),
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
