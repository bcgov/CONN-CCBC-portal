import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import useModal from 'lib/helpers/useModal';
import StatusInformationModal from './StatusInformationModal';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px;
`;

interface StatusInformationIconProps {
  type?: 'cbc' | 'ccbc';
}

const StatusInformationIcon = ({ type }: StatusInformationIconProps) => {
  const modalProps = useModal();

  const handleClick = () => {
    modalProps.open();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <>
      <StatusInformationModal type={type} {...modalProps} />
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
