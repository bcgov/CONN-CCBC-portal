import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const StyledToggleButton = styled.button<ToggleProps>`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.links};
  overflow: hidden;
  transition: max-height 0.5s;

  & svg {
    margin-left: 16px;
    margin-right: 8px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

interface ToggleProps {
  isOpen: boolean;
}

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-bottom: 5px;
  margin-top: 5px;
`;

const DropdownList = ({ items, hideText, showText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <StyledToggleButton onClick={toggleDropdown} isOpen={isOpen}>
        {isOpen ? (
          <FontAwesomeIcon icon={faChevronDown} />
        ) : (
          <FontAwesomeIcon icon={faChevronRight} />
        )}
        {isOpen ? hideText : showText}
      </StyledToggleButton>
      {isOpen && (
        <>
          {items.map((item) => (
            <StyledContainer key={item}>{item}</StyledContainer>
          ))}
        </>
      )}
    </div>
  );
};

export default DropdownList;
