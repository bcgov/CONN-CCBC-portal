import { useRouter } from 'next/router';
import styled from 'styled-components';
import Modal from 'components/Modal';

const StyledContent = styled.div`
  width: 500px;
  b {
    color: ${(props) => props.theme.color.components};
  }
`;

const ConditionalApprovalContent = () => {
  return (
    <>
      <p>To change the external status to conditionally approved, you must:</p>
      <ol>
        <li>Change the internal status to conditionally approved</li>
        <li>
          Record the <b>Minister&apos;s decision</b> regarding the conditional
          approval and the <b>Applicant&apos;s response</b>
        </li>
      </ol>
    </>
  );
};

const ChangeInternalStatusContent = () => {
  return (
    <div>
      You must change the internal status before changing the external status.
    </div>
  );
};

interface Props {
  modalOpen: boolean;
  applicationId?: number;
  id?: string;
  isNotAllowedConditionalApproval;
  onCancel?: Function;
}

const ExternalChangeModal: React.FC<Props> = ({
  id = 'change-modal',
  modalOpen,
  applicationId,
  isNotAllowedConditionalApproval,
  onCancel = () => {},
}) => {
  const router = useRouter();
  const isProjectPage = router.asPath.includes(
    `/analyst/application/${applicationId}/project`
  );

  const title = isNotAllowedConditionalApproval
    ? 'Cannot update external status'
    : 'Change internal status first';

  const changeInternalStatuActions = [
    {
      id: 'change-internal-status-modal-ok',
      label: 'Ok',
      onClick: () => onCancel(),
    },
  ];

  const conditionalApprovalActions = [
    ...(isProjectPage
      ? [
          {
            id: 'conditional-approval-modal-project-ok',
            label: 'Take me there',
            onClick: () => onCancel(),
          },
        ]
      : [
          {
            id: 'conditional-approval-modal-take-me-there',
            label: 'Take me there',
            onClick: () =>
              router.push(`/analyst/application/${applicationId}/project`),
          },
        ]),
    {
      id: 'conditional-approval-modal-close',
      label: 'Close',
      variant: 'secondary',
      onClick: () => onCancel(),
    },
  ];

  return (
    <Modal
      id={id}
      open={modalOpen}
      onClose={onCancel}
      title={title}
      actions={
        isNotAllowedConditionalApproval
          ? conditionalApprovalActions
          : changeInternalStatuActions
      }
    >
      <StyledContent>
        {isNotAllowedConditionalApproval ? (
          <ConditionalApprovalContent />
        ) : (
          <ChangeInternalStatusContent />
        )}
      </StyledContent>
    </Modal>
  );
};

export default ExternalChangeModal;
