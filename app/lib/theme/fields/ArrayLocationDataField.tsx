import { ArrayFieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
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
                    <StyledButton
                      data-testid="add-community-button"
                      type="button"
                      onClick={onAddClick}
                    >
                      Add
                    </StyledButton>
                    <StyledButton
                      type="button"
                      data-testid="clear-community-button"
                      variant="secondary"
                      onClick={handleClearTopCommunity}
                    >
                      Clear
                    </StyledButton>
                  </>
                )}
              </StyledDiv>

              <hr
                style={{
                  borderTop: 'grey dashed 1px',
                  marginTop: '19px',
                  backgroundColor: 'white',
                }}
              />
            </div>
          ) : (
            <StyledDiv>
              {element.children}
              <button
                type="button"
                data-testid="delete-community-source-button"
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
                <FontAwesomeIcon
                  width={10}
                  icon={faTrash}
                  color="rgb(189, 36, 36)"
                />
              </button>
            </StyledDiv>
          )}
        </div>
      ))}
    </>
  );
};

export default ArrayLocationFieldTemplate;
