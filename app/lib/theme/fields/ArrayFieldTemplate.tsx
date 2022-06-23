import Button from '@button-inc/bcgov-theme/Button';

import styled from 'styled-components';
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

const ArrayFieldTemplate = (props: any) => {
  return (
    <div>
      {props.items.map((element: any, i: number) => {
        return (
          <div key={i}>
            {i != 0 && (
              <StyledDiv>
                <StyledButton onClick={element.onDropIndexClick(element.index)}>
                  Remove
                </StyledButton>
              </StyledDiv>
            )}

            {element.children}
            <hr />
          </div>
        );
      })}
      {props.canAdd && (
        <Button onClick={props.onAddClick}>Add another funding source</Button>
      )}
    </div>
  );
};

export default ArrayFieldTemplate;
