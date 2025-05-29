import Modal from 'components/Modal';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import DownloadLink from 'components/DownloadLink';
import FileHeader from './FileHeader';

const StyledSection = styled.div`
  margin-bottom: 12px;
`;

const StyledLabel = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
`;

interface ChangeRequestData {
  amendmentNumber?: number | string;
  additionalComments?: string;
  changeRequestFormUpload?: any;
  dateApproved?: string;
  dateRequested?: string;
  descriptionOfChanges?: string;
  levelOfAmendment?: string;
  fundingAgreement?: any;
  wirelessSow?: any;
  sow?: any;
  maps?: any;
  otherFiles?: any;
}

interface Props {
  isOpen: boolean;
  cancelLabel?: string;
  description?: string | React.ReactNode;
  id?: string;
  maxLength?: number;
  onCancel?: Function;
  onChange?: Function;
  onSave: Function;
  saveLabel?: string;
  title?: string;
  value?: string;
  saveDisabled?: boolean;
  changeRequestData?: ChangeRequestData;
}

const DeleteChangeRequestModal: React.FC<Props> = ({
  isOpen,
  cancelLabel = 'No, Cancel',
  description = 'Please provide a reason for the change.',
  id = 'change-modal',
  title = 'Reason for change',
  onCancel = () => {},
  onSave = () => {},
  saveLabel = 'Save',
  changeRequestData,
}) => {
  return (
    <Modal
      id={id}
      open={isOpen}
      onClose={onCancel}
      title={title}
      actions={[
        {
          id: 'status-change-save-btn',
          label: saveLabel,
          onClick: () => onSave(),
        },
        {
          id: 'status-change-cancel-btn',
          label: cancelLabel,
          onClick: () => onCancel(),
          variant: 'secondary',
        },
      ]}
    >
      <div>
        {description && <StyledSection>{description}</StyledSection>}
        {changeRequestData && (
          <>
            {changeRequestData.amendmentNumber && (
              <StyledSection>
                <StyledLabel>Amendment #</StyledLabel>
                <span>{changeRequestData.amendmentNumber}</span>
              </StyledSection>
            )}
            {changeRequestData.descriptionOfChanges && (
              <StyledSection>
                <StyledLabel>Description of Changes</StyledLabel>
                <span>{changeRequestData.descriptionOfChanges}</span>
              </StyledSection>
            )}
            {changeRequestData.levelOfAmendment && (
              <StyledSection>
                <StyledLabel>Level of Amendment</StyledLabel>
                <span>{changeRequestData.levelOfAmendment}</span>
              </StyledSection>
            )}
            {changeRequestData.dateRequested && (
              <StyledSection>
                <StyledLabel>Date Requested</StyledLabel>
                <span>{changeRequestData.dateRequested}</span>
              </StyledSection>
            )}
            {changeRequestData.dateApproved && (
              <StyledSection>
                <StyledLabel>Date Approved</StyledLabel>
                <span>{changeRequestData.dateApproved}</span>
              </StyledSection>
            )}
            {changeRequestData.additionalComments && (
              <StyledSection>
                <StyledLabel>Additional Comments</StyledLabel>
                <span>{changeRequestData.additionalComments}</span>
              </StyledSection>
            )}
            {changeRequestData.fundingAgreement && (
              <StyledSection>
                <StyledLabel>Funding Agreement</StyledLabel>
                <DownloadLink
                  uuid={changeRequestData.fundingAgreement.uuid}
                  fileName={changeRequestData.fundingAgreement.name}
                >
                  <FileHeader icon={faFileContract} title="Funding Agreement" />
                </DownloadLink>
              </StyledSection>
            )}
            {changeRequestData.sow && (
              <StyledSection>
                <StyledLabel>SoW</StyledLabel>
                <DownloadLink
                  uuid={changeRequestData.sow.uuid}
                  fileName={changeRequestData.sow.name}
                >
                  <FileHeader icon={faFileContract} title="SoW" />
                </DownloadLink>
              </StyledSection>
            )}
            {changeRequestData.maps?.length > 0 && (
              <StyledSection>
                <StyledLabel>Maps</StyledLabel>
                {changeRequestData.maps.map((mapItem) => (
                  <div key={mapItem.uuid} style={{ marginBottom: 4 }}>
                    <DownloadLink uuid={mapItem.uuid} fileName={mapItem.name}>
                      <FileHeader icon={faFileContract} title={mapItem.name} />
                    </DownloadLink>
                  </div>
                ))}
              </StyledSection>
            )}
            {changeRequestData.wirelessSow && (
              <StyledSection>
                <StyledLabel>Wireless SoW</StyledLabel>
                <DownloadLink
                  uuid={changeRequestData.wirelessSow.uuid}
                  fileName={changeRequestData.wirelessSow.name}
                >
                  <FileHeader icon={faFileContract} title="Wireless SoW" />
                </DownloadLink>
              </StyledSection>
            )}
            {changeRequestData.otherFiles?.length > 0 && (
              <StyledSection>
                <StyledLabel>Other files</StyledLabel>
                {changeRequestData.otherFiles.map((otherFile) => (
                  <div key={otherFile.uuid} style={{ marginBottom: 4 }}>
                    <DownloadLink
                      uuid={otherFile.uuid}
                      fileName={otherFile.name}
                    >
                      <FileHeader
                        icon={faFileContract}
                        title={otherFile.name}
                      />
                    </DownloadLink>
                  </div>
                ))}
              </StyledSection>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default DeleteChangeRequestModal;
