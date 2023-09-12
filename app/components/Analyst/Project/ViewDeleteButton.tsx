import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.color.error};
  font-size: 14px;
  font-weight: 700;

  & svg {
    margin-left: 4px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

interface Props {
  onClick: () => void;
}

const ViewDeleteButton: React.FC<Props> = ({ onClick }) => (
  <StyledButton onClick={onClick}>
    Delete
    <FontAwesomeIcon icon={faClose} />
  </StyledButton>
);

export default ViewDeleteButton;
