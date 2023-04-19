import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';
import formatStatus from 'utils/formatStatus';
import { useSubmitConditionalApprovalMutation } from 'schema/mutations/project/submitConditionalApproval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import StyledStatus from './StyledStatus';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  z-index: 2;
`;

const ModalButtons = styled('div')`
  & button {
    margin-right: 1em;
  }
`;

const StyledContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;

  & svg {
    margin: 0 16px;
  }
`;

const StyledHeader = styled(Modal.Header)`
  padding: 16px;

  & h2 {
    margin: 0;
  }
`;

interface Props {
  applicationStoreId: string;
  rowId: number;
  formData: any;
  newFormStatus: string;
  oldFormStatus: string;
  resetFormData: any;
  setIsFormEditMode: any;
  setOldFormData: any;
}

const ConditionalApprovalModal: React.FC<Props> = ({
  applicationStoreId,
  rowId,
  formData,
  newFormStatus,
  oldFormStatus = 'Received',
  resetFormData,
  setIsFormEditMode,
  setOldFormData,
}) => {
  const [submitConditionalApproval] = useSubmitConditionalApprovalMutation();

  const handleSave = async () => {
    submitConditionalApproval({
      variables: {
        input: {
          _applicationId: rowId,
          _jsonData: formData,
          newApplicationStatus: newFormStatus,
        },
      },
      onCompleted: () => {
        setOldFormData();
        setIsFormEditMode();
      },
      updater: (store) => {
        store
          .get(applicationStoreId)
          .setValue(formatStatus(newFormStatus), 'externalStatus');
      },
    });
  };

  return (
    <StyledModal id="conditional-approval-modal">
      <StyledHeader>
        <h2>Applicant Status</h2>
      </StyledHeader>
      <StyledContent>
        <p>
          This will change what the <b>Applicant</b> sees from
        </p>
        <StyledFlex>
          <StyledStatus
            statusType={oldFormStatus}
            data-testid="old-form-status"
          >
            {oldFormStatus}
          </StyledStatus>
          <FontAwesomeIcon icon={faArrowRight} />
          <StyledStatus
            statusType={newFormStatus}
            data-testid="new-form-status"
          >
            {newFormStatus}
          </StyledStatus>
        </StyledFlex>
        <p>
          Would you like to change the applicant&apos;s status and save your
          responses?
        </p>
        <ModalButtons>
          <Modal.Close>
            <Button onClick={handleSave}>Yes, change it</Button>
          </Modal.Close>
          <Modal.Close>
            <Button
              variant="secondary"
              onClick={() => {
                resetFormData();
                setIsFormEditMode();
                window.history.replaceState(null, null, ' ');
              }}
            >
              No
            </Button>
          </Modal.Close>
        </ModalButtons>
      </StyledContent>
    </StyledModal>
  );
};

export default ConditionalApprovalModal;
