import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px;
`;

const CbcCreateIcon = ({ handleClick }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-labelledby="Create new CBC project"
      style={{ cursor: 'pointer' }}
      data-testid="create-cbc-dashboard-icon"
    >
      <StyledFontAwesome icon={faPlus} fixedWidth size="lg" />
    </div>
  );
};

export default CbcCreateIcon;
