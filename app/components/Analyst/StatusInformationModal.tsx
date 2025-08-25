import styled from 'styled-components';
import Modal from 'components/Modal';
import CbcStatusInformationModal from './CBC/CbcStatusInformation';
import CcbcStatusInformation from './CcbcStatusInformation';

interface StyledHeaderProps {
  children?: React.ReactNode;
}

const StyledHeader = styled.h3<StyledHeaderProps>`
  text-decoration: underline;
`;

interface Props {
  id?: string;
  title?: string;
  type?: 'cbc' | 'ccbc';
  close: () => void;
  isOpen: boolean;
}

const StatusInformationModal: React.FC<Props> = ({
  id = 'status-information-modal',
  title = 'Description of Statuses and Triggers',
  type,
  isOpen,
  close,
}) => (
  <Modal id={id} onClose={close} open={isOpen} title={title}>
    {!type && (
      <>
        <StyledHeader>CCBC</StyledHeader>
        <CcbcStatusInformation />
        <StyledHeader>CBC</StyledHeader>
        <CbcStatusInformationModal />
      </>
    )}
    {type === 'ccbc' && <CcbcStatusInformation />}
    {type === 'cbc' && <CbcStatusInformationModal />}
  </Modal>
);

export default StatusInformationModal;
