import Modal from 'components/Modal';
import Button from '@button-inc/bcgov-theme/Button';
import styled from 'styled-components';
import { useFeature } from '@growthbook/growthbook-react';

function getModalText(intakeZones, modalType) {
  if (modalType === 'invalid-geographic-area') {
    return `Invalid selection. You have indicated that this project is not led or supported by First Nations, therefore, you may only choose from Zones ${intakeZones}.`;
  }
  if (modalType === 'first-nations-led') {
    return `Invalid selection. Please first choose from Zones ${intakeZones} if this project is not supported or led by First Nations.`;
  }
  return `For this intake, CCBC is considering projects that are in Zones ${intakeZones} if the project is not First Nations-led or First Nations-supported.`;
}

const ProjectAreaModal = ({
  setProjectAreaModalOpen,
  projectAreaModalOpen,
  projectAreaModalType,
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
          {getModalText(
            acceptedIntakeZonesArray?.join(', '),
            projectAreaModalType
          )}
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
