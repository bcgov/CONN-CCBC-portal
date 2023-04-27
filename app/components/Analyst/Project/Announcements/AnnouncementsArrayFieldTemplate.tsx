import Button from '@button-inc/bcgov-theme/Button';
import styled from 'styled-components';
import { ArrayFieldTemplateProps } from '@rjsf/core';

const StyledDiv = styled('div')`
  display: flex;
  justify-content: flex-end;
  min-width: 100%;
`;

const StyledButton = styled('button')`
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  color: ${(props) => props.theme.color.links};
`;

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  // Todo: unlikely needed for this project but we could look at better customization
  // options if we bring this into the toolkit.
  const { canAdd, items, onAddClick, title, uiSchema } = props;
  console.log(props);
  const uiArrayButtons = uiSchema?.items?.['ui:array-buttons'];

  return (
    <div>
      {title && <h2>{title}</h2>}
      {items.map((item, i: number) => (
        <div key={item.key}>
          {i !== 0 && (
            <StyledDiv>
              <StyledButton onClick={item.onDropIndexClick(item.index)}>
                {uiArrayButtons?.removeBtnLabel || 'Remove'}
              </StyledButton>
            </StyledDiv>
          )}

          {item.children}
          <hr />
        </div>
      ))}

      {canAdd && (
        <Button onClick={onAddClick}>
          {uiArrayButtons?.addBtnLabel || 'Add'}
        </Button>
      )}
    </div>
  );
};

export default ArrayFieldTemplate;
