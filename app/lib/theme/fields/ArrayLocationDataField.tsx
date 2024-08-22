import { ArrayFieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
                    <button type="button" onClick={onAddClick}>
                      Add
                    </button>
                    <button type="button" onClick={handleClearTopCommunity}>
                      Clear
                    </button>
                  </>
                )}
              </StyledDiv>

              <hr style={{ borderTop: 'dotted 1px' }} />
            </div>
          ) : (
            <StyledDiv>
              {element.children}
              <button
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
              </button>
            </StyledDiv>
          )}
        </div>
      ))}
    </>
  );
};

export default ArrayLocationFieldTemplate;
