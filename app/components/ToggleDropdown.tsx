import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface StyledToggleButtonProps {
  children?: React.ReactNode;
  'data-testid'?: string;
  onClick?: () => void;
  isOpen?: boolean;
}

const StyledToggleButton = styled.button<StyledToggleButtonProps>`
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

interface StyledContainerProps {
  children?: React.ReactNode;
}

const StyledContainer = styled.div<StyledContainerProps>`
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const DropdownList = ({ items, hideText, showText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <StyledToggleButton
        data-testid="toggle-button"
        onClick={toggleDropdown}
        isOpen={isOpen}
      >
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
