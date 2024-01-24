import Modal from 'components/Modal';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const StyledText = styled.p`
  text-align: center;
`;

const ConflictModal = ({ modalOpen, setModalOpen }) => {
  const router = useRouter();
  return (
    <Modal
      id="conflict-modal"
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      title="Error"
      actions={[
        {
          id: 'btn-refresh-and-continue',
          label: 'Refresh & Continue',
          onClick: () => {
            setModalOpen(false);
            router.reload();
          },
        },
      ]}
    >
      <StyledText>
        The form could not save. This sometimes happens when your application is
        open in multiple tabs.
      </StyledText>
      <StyledText>
        Unfortunately any recent work on this page has been lost.
      </StyledText>
    </Modal>
  );
};

export default ConflictModal;
