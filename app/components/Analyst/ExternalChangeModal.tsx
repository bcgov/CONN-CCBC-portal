import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  z-index: 2;

  & button {
    margin-right: 1em;
  }
`;

const StyledContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;

  b {
    color: ${(props) => props.theme.color.components};
  }
`;

const StyledButtons = styled.div`
  width: fit-content;
`;

const StyledHeader = styled(Modal.Header)`
  font-weight: bold;
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
  applicationId?: number;
  id?: string;
  isNotAllowedConditionalApproval;
  onCancel?: Function;
}

const ExternalChangeModal: React.FC<Props> = ({
  id = 'change-modal',
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

  return (
    <StyledModal id={id}>
      <StyledHeader>{title}</StyledHeader>
      <StyledContent>
        {isNotAllowedConditionalApproval ? (
          <ConditionalApprovalContent />
        ) : (
          <ChangeInternalStatusContent />
        )}
        <StyledButtons>
          {isNotAllowedConditionalApproval ? (
            <>
              {isProjectPage ? (
                <Modal.Close>
                  <Button onClick={() => onCancel()}>Take me there</Button>
                </Modal.Close>
              ) : (
                <Modal.Close>
                  <Link href={`/analyst/application/${applicationId}/project`}>
                    <Button>Take me there</Button>
                  </Link>
                </Modal.Close>
              )}
              <Modal.Close>
                <Button variant="secondary" onClick={() => onCancel()}>
                  Close
                </Button>
              </Modal.Close>
            </>
          ) : (
            <Modal.Close>
              <Button onClick={() => onCancel()}>Ok</Button>
            </Modal.Close>
          )}
        </StyledButtons>
      </StyledContent>
    </StyledModal>
  );
};

export default ExternalChangeModal;
