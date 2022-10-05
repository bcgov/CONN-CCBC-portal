import { ArrayFieldTemplateProps } from '@rjsf/core';
import React from 'react';
import { StyledH4, StyledTitleRow } from '../index';

const ReviewArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
  const { items, uiSchema } = props;

  return (
    <>
      {items.map((el, index) => (
        <React.Fragment key={index}>
          <tr>
            <StyledTitleRow colSpan={2}>
              <StyledH4>
                {index + 1}. {uiSchema?.['ui:itemTitle']}
              </StyledH4>
            </StyledTitleRow>
          </tr>
          {el.children}
        </React.Fragment>
      ))}
    </>
  );
};

export default ReviewArrayFieldTemplate;
