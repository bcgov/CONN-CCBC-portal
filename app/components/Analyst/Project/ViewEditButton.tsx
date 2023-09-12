import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.color.links};
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
    View
    <FontAwesomeIcon icon={faPen} />
  </StyledButton>
);

export default ViewDeleteButton;
