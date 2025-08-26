import Modal from 'components/Modal';
import { useRouter } from 'next/router';
import styled from 'styled-components';

interface StyledTextProps {
  children?: React.ReactNode;
}

const StyledText = styled.p<StyledTextProps>`
  text-align: center;
`;

const ConflictModal = ({ isOpen, close }) => {
  const router = useRouter();
  return (
    <Modal
      id="conflict-modal"
      open={isOpen}
      onClose={() => {
        close();
      }}
      title="Error"
      actions={[
        {
          id: 'btn-refresh-and-continue',
          label: 'Refresh & Continue',
          onClick: () => {
            close();
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
