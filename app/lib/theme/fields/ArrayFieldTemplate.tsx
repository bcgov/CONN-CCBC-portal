import Button from '@button-inc/bcgov-theme/Button';
import styled from 'styled-components';
import { ArrayFieldTemplateProps } from '@rjsf/utils';

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
  const { canAdd, items, onAddClick, uiSchema } = props;
  const uiArrayButtons = uiSchema?.items?.['ui:array-buttons'];
  return (
    <div>
      {items?.map((item, i: number) => (
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
