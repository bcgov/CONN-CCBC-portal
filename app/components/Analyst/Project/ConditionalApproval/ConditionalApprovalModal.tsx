import styled from 'styled-components';
import formatStatus from 'utils/formatStatus';
import { useSubmitConditionalApprovalMutation } from 'schema/mutations/project/submitConditionalApproval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Modal from 'components/Modal';
import StyledStatus from './StyledStatus';

const StyledContent = styled.div`
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

interface Props {
  isOpen: boolean;
  close: Function;
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
  isOpen,
  close,
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
        close();
      },
      updater: (store, data) => {
        store
          .get(applicationStoreId)
          .setValue(formatStatus(newFormStatus), 'externalStatus')
          .setLinkedRecord(
            store.get(
              data.submitConditionallyApproved.conditionalApprovalData.id
            ),
            'conditionalApproval'
          );
      },
    });
  };

  return (
    <Modal
      id="conditional-approval-modal"
      open={isOpen}
      onClose={close}
      title="Applicant Status"
      actions={[
        {
          id: 'conditional-approval-modal-save-btn',
          label: 'Yes, change it',
          onClick: handleSave,
        },
        {
          id: 'conditional-approval-modal-cancel-btn',
          label: 'No',
          variant: 'secondary',
          onClick: () => {
            resetFormData();
            setIsFormEditMode();
            close();
          },
        },
      ]}
    >
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
      </StyledContent>
    </Modal>
  );
};

export default ConditionalApprovalModal;
