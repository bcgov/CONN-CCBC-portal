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
          You may continue to edit this application, however please note that
          you will not be able to submit it during this intake. You may submit
          this application in subsequent intakes
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
