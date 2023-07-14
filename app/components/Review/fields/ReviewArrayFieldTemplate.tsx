import { ArrayFieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import { StyledH4, StyledTitleRow } from 'components/Review/Components';

const ReviewArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
  const { items, uiSchema } = props;

  return (
    <>
      {items.map((el, index) => (
        // eslint-disable-next-line react/no-array-index-key
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
