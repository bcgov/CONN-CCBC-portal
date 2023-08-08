import Modal from '@button-inc/bcgov-theme/Modal';
import Button from '@button-inc/bcgov-theme/Button';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const StyledText = styled.p`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ConflictModal = ({ id }) => {
  const router = useRouter();
  return (
    <Modal id={id}>
      <Modal.Header>Error</Modal.Header>
      <Modal.Content>
        <StyledText>
          The form could not save. This sometimes happens when your application
          is open in multiple tabs.
        </StyledText>
        <StyledText>
          Unfortunately any recent work on this page has been lost
        </StyledText>
        <ButtonContainer>
          <Button
            onClick={() => {
              window.location.hash = '';
              router.reload();
            }}
          >
            Refresh & Continue
          </Button>
        </ButtonContainer>
      </Modal.Content>
    </Modal>
  );
};

export default ConflictModal;
