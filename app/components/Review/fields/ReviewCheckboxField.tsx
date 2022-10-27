import React from 'react';
import { FieldProps } from '@rjsf/core';
import { StyledColLeft, StyledColRight, StyledColError } from '../index';

// Field to display a list of yes/no values instead of the enum for array type fields
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
