import { FieldProps } from '@rjsf/core';
import React from 'react';
import { StyledColLeft, StyledColRight, StyledColError } from '../index';

const ReviewInlineArrayField: React.FC<FieldProps> = ({
  id,
  formData,
  rawErrors,
  schema,
}) => {
  return (
    <tr>
      <StyledColLeft id={id}>{schema.title}</StyledColLeft>
      {rawErrors && rawErrors.length > 0 ? (
        <StyledColError id={`${id}-error`} />
      ) : (
        <StyledColRight id={`${id}-value`}>
          {formData?.map((el, index) => (
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
};

export default ReviewInlineArrayField;
