import Modal from 'components/Modal';
import styled from 'styled-components';

function getModalText(intakeZones, modalType, allowUnlistedFnLedZones) {
  if (!allowUnlistedFnLedZones) {
    if (
      modalType === 'invalid-geographic-area' ||
      modalType === 'first-nations-led'
    ) {
      return `Invalid selection. You may only choose from Zones ${intakeZones}.`;
    }
    return `For this intake, CCBC is considering projects that are in Zones ${intakeZones}.`;
  }
  if (modalType === 'invalid-geographic-area') {
    return `Invalid selection. You have indicated that this project is not led or supported by First Nations, therefore, you may only choose from Zones ${intakeZones}.`;
  }
  if (modalType === 'first-nations-led') {
    return `Invalid selection. Please first choose from Zones ${intakeZones} if this project is not supported or led by First Nations.`;
  }
  return `For this intake, CCBC is considering projects that are in Zones ${intakeZones} if the project is not First Nations-led or First Nations-supported.`;
}

const ProjectAreaModal = ({
  isOpen,
  close,
  projectAreaModalType,
  acceptedProjectAreasArray = [],
  allowUnlistedFnLedZones = true,
}) => {
  const acceptedIntakeZones =
    acceptedProjectAreasArray?.length >= 2
      ? `${acceptedProjectAreasArray.slice(0, -1).join(', ')}, or ${
          acceptedProjectAreasArray[acceptedProjectAreasArray.length - 1]
        }`
      : acceptedProjectAreasArray.join(', ');

  const StyledContainer = styled.div`
    text-align: center;
  `;
  return (
    <Modal
      id="project-area-warning"
      open={isOpen}
      title="Zone Alert"
      size="sm"
      onClose={close}
      actions={[
        {
          id: 'project-modal-ok',
          label: 'Ok',
          onClick: close,
        },
      ]}
    >
      <StyledContainer>
        <p>
          {getModalText(
            acceptedIntakeZones,
            projectAreaModalType,
            allowUnlistedFnLedZones
          )}
        </p>
      </StyledContainer>
    </Modal>
  );
};

export default ProjectAreaModal;
