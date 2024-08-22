import { ArrayFieldTemplateProps } from '@rjsf/utils';
import React from 'react';

const ArrayLocationFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { items, onAddClick, canAdd, formContext } = props;

  const deleteCommunitySource = formContext?.deleteCommunitySource as Function;
  // const addCommunitySource = formContext?.addCommunitySource as Function;

  // const handleAddClick = () => {
  //   const newItems = items.map()
  // }

  return (
    <>
      {items.map((element, index) => (
        <div key={element.key}>
          {index === 0 ? (
            <div>
              <div>
                {element.children}
                {canAdd && (
                  <button
                    type="button"
                    onClick={(event) => {
                      onAddClick(event);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>

              <hr style={{ borderTop: 'dotted 1px' }} />
            </div>
          ) : (
            <div>
              {element.children}
              <button
                type="button"
                onClick={() => {
                  // get the value of the community source id
                  const comSourceId =
                    element.children.props.formData.geographicNameId;
                  console.log(element.children.props.formData);
                  if (deleteCommunitySource) {
                    // function to delete source
                    deleteCommunitySource(comSourceId);
                  }
                  element.onDropIndexClick(element.index);
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ArrayLocationFieldTemplate;
