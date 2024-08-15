import { ArrayFieldTemplateProps } from '@rjsf/utils';
import React from 'react';

const ArrayLocationFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { items, onAddClick, canAdd } = props;

  return (
    <>
      {items.map((element, index) => (
        <div key={element.key}>
          {index === 0 ? (
            <div>
              <div>
                {element.children}
                {canAdd && (
                  <button type="button" onClick={onAddClick}>
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
                onClick={element.onDropIndexClick(element.index)}
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
