import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { ArrayFieldTemplateProps } from '@rjsf/core';

const StyledButton = styled('button')`
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => props.theme.color.links};
  margin-bottom: 16px;

  & svg {
    margin-left: 16px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { canAdd, items, onAddClick, title, uiSchema } = props;
  const uiArrayButtons = uiSchema?.items?.['ui:array-buttons'];
  const before = uiSchema?.['ui:before'];

  return (
    <div>
      {before}
      {title && <h2>{title}</h2>}
      {items.map((item) => (
        <div key={item.key}>{item.children}</div>
      ))}

      {canAdd && (
        <StyledButton onClick={onAddClick}>
          {uiArrayButtons?.addBtnLabel || 'Add'}
          <FontAwesomeIcon icon={faPlus} />
        </StyledButton>
      )}
    </div>
  );
};

export default ArrayFieldTemplate;
