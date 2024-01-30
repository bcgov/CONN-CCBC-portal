import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import useModal from 'lib/helpers/useModal';
import StatusInformationModal from './StatusInformationModal';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px; ;
`;

const StatusInformationIcon = () => {
  const statusInformationModal = useModal();

  const handleClick = () => {
    statusInformationModal.open();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <>
      <StatusInformationModal {...statusInformationModal} />
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-labelledby="Description of Statuses and Triggers"
        style={{ cursor: 'pointer' }}
        data-testid="status-information-icon"
      >
        <StyledFontAwesome
          icon={faCircleInfo}
          fixedWidth
          size="lg"
          color="#345FA9"
        />
      </div>
    </>
  );
};

export default StatusInformationIcon;
