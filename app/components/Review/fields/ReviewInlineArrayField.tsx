import { FieldProps } from '@rjsf/core';
import React from 'react';
import {
  StyledColLeft,
  StyledColRight,
  StyledColError,
} from 'components/Review/Components';

const ReviewInlineArrayField: React.FC<FieldProps> = ({
  id,
  formData,
  rawErrors,
  schema,
}) => (
  <tr>
    <StyledColLeft id={id}>{schema.title}</StyledColLeft>
    {rawErrors && rawErrors.length > 0 ? (
      <StyledColError id={`${id}-error`} />
    ) : (
      <StyledColRight id={`${id}-value`}>
        {formData?.map((el, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`${id}_${index}`}>
            {el.toString()}
            {index < formData.length - 1 && (
              <>
                ,<br />
              </>
            )}
          </React.Fragment>
        ))}
      </StyledColRight>
    )}
  </tr>
);

export default ReviewInlineArrayField;
