import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useState } from 'react';
import StatusInformationModal from './StatusInformationModal';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px; ;
`;

const StatusInformationIcon = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    // window.location.hash = '#status-information-modal';
    setShowModal(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <StatusInformationModal open={showModal} onClose={hideModal} />
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
