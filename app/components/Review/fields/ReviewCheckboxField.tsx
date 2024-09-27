import React from 'react';
import { FieldProps } from '@rjsf/utils';
import { StyledColLeft, StyledColRight } from 'components/Review/Components';

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
            <StyledColRight id={`${id}-error`} hasError />
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
