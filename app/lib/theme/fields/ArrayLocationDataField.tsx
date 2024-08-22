import { ArrayFieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  height: 40px;
  padding: 5px;
  margin: 2px;
`;

const ArrayLocationFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { items, onAddClick, canAdd, formContext } = props;

  const deleteCommunitySource = formContext?.deleteCommunitySource as Function;
  const handleClearTopCommunity = () => {
    if (
      formContext?.handleClearTopCommunity &&
      formContext?.handleClearTopCommunity instanceof Function
    ) {
      formContext?.handleClearTopCommunity();
    }
  };

  return (
    <>
      {items.map((element, index) => (
        <div key={element.key}>
          {index === 0 ? (
            <div>
              <StyledDiv>
                {element.children}
                {canAdd && (
                  <>
                    <StyledButton type="button" onClick={onAddClick}>
                      Add
                    </StyledButton>
                    <StyledButton
                      type="button"
                      variant="secondary"
                      onClick={handleClearTopCommunity}
                    >
                      Clear
                    </StyledButton>
                  </>
                )}
              </StyledDiv>

              <hr style={{ borderTop: 'dotted 1px' }} />
            </div>
          ) : (
            <StyledDiv>
              {element.children}
              <StyledButton
                type="button"
                onClick={() => {
                  // get the value of the community source id
                  const comSourceId =
                    element.children.props.formData.geographicNameId;
                  if (deleteCommunitySource) {
                    // function to delete source
                    deleteCommunitySource(comSourceId);
                  }
                  element.onDropIndexClick(element.index);
                }}
              >
                Remove
              </StyledButton>
            </StyledDiv>
          )}
        </div>
      ))}
    </>
  );
};

export default ArrayLocationFieldTemplate;
