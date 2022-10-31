import React from 'react';
import { FieldProps } from '@rjsf/core';
import { StyledColLeft, StyledColRight, StyledColError } from '../index';

const ReviewCheckboxField: React.FC<FieldProps> = ({
  id,
  formContext,
  formData,
  schema,
}) => {
  const isChecked = formData;
  const isErrors = Object.keys(formContext.errors).length > 0;
  return (
    <tr>
      {isErrors ? (
        <>
          <StyledColLeft id={id}>{schema.title}</StyledColLeft>
          {isChecked ? (
            <StyledColRight id={`${id}-value`}>Yes</StyledColRight>
          ) : (
            <StyledColError id={`${id}-error`} />
          )}
        </>
      ) : (
        <StyledColLeft style={{ borderRight: 0 }}>
          All mandatory fields are filled
        </StyledColLeft>
      )}
    </tr>
  );
};

export default ReviewCheckboxField;
