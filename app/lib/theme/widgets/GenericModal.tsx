import Button from '@button-inc/bcgov-theme/Button';
import Modal from '@button-inc/bcgov-theme/Modal';
import styled from 'styled-components';

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
const XIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1L17 17" stroke="white" />
    <path d="M1 17L17 1" stroke="white" />
  </svg>
);

// using vanilla js
const closeMe = (e: React.MouseEvent<HTMLInputElement>) => {
  // hack around RJSF event propagation
  e.preventDefault(); 
  e.stopPropagation();    
  const xButton = document.getElementsByClassName("pg-modal-close")[0] as HTMLButtonElement;
  xButton.click();
}

const GenericModal = ({ id, message='', title='' }) => {
  return (
    <StyledModal id={id}>
      <Modal.Header>
        {title}
        <Modal.Close>
          <XIcon />
        </Modal.Close>
      </Modal.Header>
      <Modal.Content>
        <p>
          {message}
        </p>
        <ModalButtons>
          <Modal.Close>
            <Button onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                closeMe(e);              
              }} 
              data-testid="generic-yes-btn">
              Ok
            </Button>
          </Modal.Close> 
        </ModalButtons>
      </Modal.Content>
    </StyledModal>
  );
};

export default GenericModal;
