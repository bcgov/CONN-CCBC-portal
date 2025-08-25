import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface EditProps {
  isFormEditMode: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const StyledAddButton = styled.button<EditProps>`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.links};
  margin-bottom: ${(props) => (props.isFormEditMode ? '0px' : '16px')};
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '0px' : '30px')};
  transition: max-height 0.5s;

  & svg {
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

interface Props {
  isFormEditMode: boolean;
  onClick?: () => void;
  title: string;
}

const AddButton: React.FC<Props> = ({ isFormEditMode, onClick, title }) => {
  return (
    <StyledAddButton onClick={onClick} isFormEditMode={isFormEditMode}>
      <span>{title}</span>
      <FontAwesomeIcon icon={faPlus} />
    </StyledAddButton>
  );
};

export default AddButton;
