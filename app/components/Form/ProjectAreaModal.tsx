import Modal from 'components/Modal';
import Button from '@button-inc/bcgov-theme/Button';
import styled from 'styled-components';

const projectAreaModal = ({
  setProjectAreaModalOpen,
  projectAreaModalOpen,
}) => {
  const StyledContainer = styled.div`
    text-align: center;
    max-width: 400px;

    p {
      margin-top: 16px;
    }
  `;

  const StyledFlex = styled.div`
    display: flex;
    justify-content: center;

    button:first-child {
      margin-right: 16px;
    }
  `;
  return (
    <Modal
      id="project-area-warning"
      open={projectAreaModalOpen}
      title="Submission Update"
      onClose={() => {
        setProjectAreaModalOpen(false);
      }}
    >
      <StyledContainer>
        <p>
          You have selected a zone that is not within the areas of interest for
          intake 3. You may continue editing this application, but please be
          aware that you will not be able to submit it during this intake.
        </p>
        <StyledFlex>
          <Button
            data-testid="project-modal-ok"
            onClick={() => setProjectAreaModalOpen(false)}
          >
            Ok
          </Button>
        </StyledFlex>
      </StyledContainer>
    </Modal>
  );
};

export default projectAreaModal;
