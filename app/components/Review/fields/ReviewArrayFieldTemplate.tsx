import { ArrayFieldTemplateProps } from '@rjsf/core';
import { StyledH4, StyledTitleRow } from '../index';
import React from 'react';

const ReviewArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
  const { items, uiSchema } = props;

  return (
    <>
      {items.map((el, index) => {
        return (
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
        );
      })}
    </>
  );
};

export default ReviewArrayFieldTemplate;
