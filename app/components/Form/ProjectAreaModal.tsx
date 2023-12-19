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
      title="Zone Alert"
      onClose={() => {
        setProjectAreaModalOpen(false);
      }}
    >
      <StyledContainer>
        <p>
          For this intake, CCBC is considering projects that are in Zones 1,2,3,
          or 6 if the project is not First Nations-led or First
          Nations-supported.
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
