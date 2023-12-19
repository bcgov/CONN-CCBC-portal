import Modal from 'components/Modal';
import Button from '@button-inc/bcgov-theme/Button';
import styled from 'styled-components';
import { useFeature } from '@growthbook/growthbook-react';

const ProjectAreaModal = ({
  setProjectAreaModalOpen,
  projectAreaModalOpen,
}) => {
  // necessary to use? not sure
  const acceptedIntakeZonesString = useFeature('intake_zones');
  const acceptedIntakeZonesArray: string[] = acceptedIntakeZonesString.value
    ?.split(',')
    ?.map((e) => e.trim());
  if (acceptedIntakeZonesArray?.length > 2) {
    acceptedIntakeZonesArray[acceptedIntakeZonesArray.length - 1] = `or ${
      acceptedIntakeZonesArray[acceptedIntakeZonesArray.length - 1]
    } `;
  }
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
          For this intake, CCBC is considering projects that are in Zones{' '}
          {/* Make it dependent on the growthbook zones set */}
          {acceptedIntakeZonesArray?.join(', ')}
          if the project is not First Nations-led or First Nations-supported.
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

export default ProjectAreaModal;
